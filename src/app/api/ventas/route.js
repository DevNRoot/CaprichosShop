import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/ventas
 * CREA VENTA + DETALLE + DESCUENTA STOCK (TRANSACCIÓN)
 */
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      fecha,
      total,
      metodo_de_pago,
      id_cliente,
      detalles, 
    } = body;

    if (
      !fecha ||
      !total ||
      !metodo_de_pago ||
      !id_cliente ||
      !Array.isArray(detalles) ||
      detalles.length === 0
    ) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 422 }
      );
    }

    const ventaId = await prisma.$transaction(async (tx) => {
      // 1️⃣ Crear venta
      const venta = await tx.venta.create({
        data: {
          fecha: new Date(fecha),
          total: Number(total),
          metodoDePago: metodo_de_pago,
          clienteId: Number(id_cliente),
        },
      });

      // 2️⃣ Procesar cada producto vendido
      for (const d of detalles) {
        const variante = await tx.variante.findFirst({
          where: {
            productoId: Number(d.productoId),
            colorId: Number(d.colorId),
            tallaId: Number(d.tallaId),
          },
        });

        if (!variante) {
          throw new Error("Variante no encontrada");
        }

        if (variante.stock < d.cantidad) {
          throw new Error("Stock insuficiente");
        }

        // 3️⃣ Descontar stock
        await tx.variante.update({
          where: { id: variante.id },
          data: {
            stock: {
              decrement: Number(d.cantidad),
            },
          },
        });

        // 4️⃣ Guardar detalle venta
        await tx.detalleVenta.create({
          data: {
            ventaId: venta.id,
            productoId: Number(d.productoId),
            varianteId: variante.id,
            cantidad: Number(d.cantidad),
            precioUnitario: Number(d.precioUnitario),
            total: Number(d.subTotal),
          },
        });
      }

      return venta.id;
    });

    return NextResponse.json(
      {
        message: "Venta registrada correctamente",
        venta_id: ventaId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ ERROR VENTA:", error.message);

    return NextResponse.json(
      {
        error: "Error al registrar la venta",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ventas
 */
export async function GET() {
  const ventas = await prisma.venta.findMany({
    orderBy: { id: "desc" },
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

  return NextResponse.json(ventas);
}