import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req, { params }) {
  try {
    const token = process.env.LUCODE_API_TOKEN;
    const url = process.env.LUCODE_API_URL;
    const rucEmisor = process.env.LUCODE_RUC_EMISOR;

    if (!token) {
      return NextResponse.json(
        {
          error: "LUCODE_API_TOKEN no está configurado",
        },
        { status: 500 }
      );
    }

    if (!url) {
      return NextResponse.json(
        {
          error: "LUCODE_API_URL no está configurado",
        },
        { status: 500 }
      );
    }

    if (!rucEmisor) {
      return NextResponse.json(
        {
          error: "LUCODE_RUC_EMISOR no está configurado",
        },
        { status: 500 }
      );
    }

    const ventaId = Number(params.id);

    if (!Number.isInteger(ventaId)) {
      return NextResponse.json(
        {
          error: "ID de venta inválido",
        },
        { status: 400 }
      );
    }

    const tipoComprobante = "03";
    const serie = "B002";

    const venta = await prisma.venta.findUnique({
      where: {
        id: BigInt(ventaId),
      },

      include: {
        cliente: true,

        detalleVentas: {
          include: {
            producto: true,
            variante: {
              include: {
                color: true,
                talla: true,
              },
            },
          },
        },
      },
    });

    if (!venta) {
      return NextResponse.json(
        {
          error: "Venta no encontrada",
        },
        { status: 404 }
      );
    }

    if (venta.estadoSunat === "ACEPTADO") {
      return NextResponse.json(
        {
          error: "Esta venta ya tiene una boleta aceptada por SUNAT",
          comprobante: `${venta.serie}-${venta.numero}`,
        },
        { status: 400 }
      );
    }

    const ahora = new Date();

    const fechaDeEmision = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(ahora);

    const cliente = venta.cliente;

    if (!cliente) {
      return NextResponse.json(
        {
          error: "La venta no tiene cliente asociado",
        },
        { status: 400 }
      );
    }

    const documento = String(cliente.documento).trim();

    let tipoDocumento = "1";

    if (documento.length === 11) {
      tipoDocumento = "6";
    } else if (documento.length === 8) {
      tipoDocumento = "1";
    } else {
      return NextResponse.json(
        {
          error: `El documento del cliente no es válido para una boleta: ${documento}`,
        },
        { status: 400 }
      );
    }

    const items = venta.detalleVentas.map((detalle) => {
      const cantidad = Number(detalle.cantidad);
      const precioFinal = Number(detalle.precioUnitario);
      const valorUnitario = precioFinal / 1.18;

      return {
        unidad_de_medida: "NIU",
        descripcion: detalle.producto.nombre,
        cantidad: String(cantidad),
        valor_unitario: valorUnitario.toFixed(6),
        porcentaje_igv: "18",
        codigo_tipo_afectacion_igv: "10",
        nombre_tributo: "IGV",
      };
    });

    const resultadoCorrelativo = await prisma.$queryRaw`
      UPDATE correlativos
      SET ultimo_numero = ultimo_numero + 1
      WHERE ruc_emisor = ${rucEmisor}
        AND tipo_comprobante = ${tipoComprobante}
        AND serie = ${serie}
      RETURNING ultimo_numero;
    `;

    if (resultadoCorrelativo.length === 0) {
      return NextResponse.json(
        {
          error: `No existe un correlativo configurado para el RUC, tipo de comprobante y serie indicados`,
        },
        { status: 500 }
      );
    }

    const numero = Number(resultadoCorrelativo[0].ultimo_numero);

    const comprobante = {
      documento: "boleta",
      serie,
      numero,
      fecha_de_emision: fechaDeEmision,
      moneda: "PEN",
      tipo_operacion: "0101",
      cliente_tipo_de_documento: tipoDocumento,
      cliente_numero_de_documento: documento,
      cliente_denominacion: cliente.nombre,
      cliente_direccion: "-",
      items,
      total: Number(venta.total).toFixed(2),
    };

    const respuesta = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(comprobante),
    });

    const data = await respuesta.json();

    if (!respuesta.ok || !data.success) {
      return NextResponse.json(
        {
          error: "La boleta no fue aceptada",
          httpStatus: respuesta.status,
          data,
          comprobanteIntentado: `${serie}-${String(numero).padStart(6, "0")}`,
        },
        {
          status: respuesta.status || 400,
        }
      );
    }

    const payload = data.payload;

    const ventaActualizada = await prisma.venta.update({
      where: {
        id: BigInt(ventaId),
      },

      data: {
        tipoComprobante,
        serie,
        numero: BigInt(numero),
        estadoSunat: payload?.estado ?? "ACEPTADO",
        hashSunat: payload?.hash ?? null,
        xmlUrl: payload?.xml ?? null,
        cdrUrl: payload?.cdr ?? null,
        pdfUrl: payload?.pdf?.ticket ?? null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Boleta emitida y aceptada por SUNAT",
        ventaId,
        comprobante: `${serie}-${String(numero).padStart(6, "0")}`,
        estadoSunat: ventaActualizada.estadoSunat,
        hashSunat: ventaActualizada.hashSunat,
        xmlUrl: ventaActualizada.xmlUrl,
        cdrUrl: ventaActualizada.cdrUrl,
        pdfUrl: ventaActualizada.pdfUrl,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("ERROR EMITIENDO BOLETA:", error);

    return NextResponse.json(
      {
        error: "Error al emitir la boleta",
        detail: error.message,
      },
      {
        status: 500,
      }
    );
  }
}