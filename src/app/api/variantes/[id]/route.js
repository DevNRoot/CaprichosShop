import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/variantes/{id}
 * Laravel: obtenerVariante()
 */
export async function GET(_req, { params }) {
  const id = Number(params.id);

  const variante = await prisma.variante.findUnique({
    where: { id },
    include: {
      producto: {
        include: {
          subCategoria: {
            include: { categoria: true },
          },
        },
      },
      talla: true,
      color: true,
    },
  });

  return NextResponse.json(variante);
}

/**
 * PUT /api/variantes/{id}
 * Laravel: editarVariante()
 */
export async function PUT(req, { params }) {
  const id = Number(params.id);
  const { stock } = await req.json();

  const variante = await prisma.variante.update({
    where: { id },
    data: { stock: Number(stock) },
  });

  await actualizarStockProducto(variante.productoId);

  return NextResponse.json({
    mensaje: "Stock actualizado con éxito",
    variante,
  });
}

/**
 * DELETE /api/variantes/{id}
 * Laravel: eliminarVariante()
 */
export async function DELETE(_req, { params }) {
  const id = Number(params.id);

  const variante = await prisma.variante.findUnique({
    where: { id },
  });

  await prisma.variante.delete({ where: { id } });
  await actualizarStockProducto(variante.productoId);

  return NextResponse.json({
    mensaje: "Variante eliminada correctamente",
  });
}

async function actualizarStockProducto(productoId) {
  const total = await prisma.variante.aggregate({
    where: { productoId },
    _sum: { stock: true },
  });

  await prisma.producto.update({
    where: { id: productoId },
    data: { stockTotal: total._sum.stock || 0 },
  });
}