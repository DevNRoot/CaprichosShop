import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { productos, total, id_cliente } = body;

    if (!Array.isArray(productos) || productos.length === 0) {
      return NextResponse.json(
        { error: "Productos inválidos" },
        { status: 422 }
      );
    }

    if (!id_cliente || !total) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 422 }
      );
    }

    for (const p of productos) {
      if (
        !p.producto_id ||
        !p.talla_id ||
        !p.color_id ||
        !p.cantidad ||
        !p.precio_unitario
      ) {
        return NextResponse.json(
          {
            error:
              "Cada producto debe tener producto_id, talla_id, color_id, cantidad y precio_unitario",
          },
          { status: 422 }
        );
      }
    }

    const preVenta = await prisma.preVenta.create({
      data: {
        clienteId: Number(id_cliente),
        total: total, 
        estado: 0,
        fecha: new Date(),
      },
    });

    const operacionesDetalles = productos.map((producto) =>
      prisma.detallePreVenta.create({
        data: {
          preVentaId: preVenta.id,
          productoId: Number(producto.producto_id),
          tallaId: Number(producto.talla_id),
          colorId: Number(producto.color_id),
          cantidad: Number(producto.cantidad),
          precioUnitario: producto.precio_unitario,
          subTotal: producto.sub_total,
        },
      })
    );

    await prisma.$transaction(operacionesDetalles);

    return NextResponse.json(
      { message: " Pre venta guardada correctamente" },
      { status: 201 }
    );
  } catch (error) {
    console.error(" ERROR PRE-VENTA:", error);

    return NextResponse.json(
      {
        error: "Error al guardar la pre venta",
        detalle: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const preVentas = await prisma.preVenta.findMany({
    orderBy: { id: "desc" },
  });

  return NextResponse.json(preVentas);
}