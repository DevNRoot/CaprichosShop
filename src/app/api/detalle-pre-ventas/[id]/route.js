import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const id = Number(params.id);

  const detalle = await prisma.detallePreVenta.findUnique({
    where: { id },
  });

  if (!detalle) {
    return NextResponse.json(
      { mensaje: "Detalle no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(detalle);
}