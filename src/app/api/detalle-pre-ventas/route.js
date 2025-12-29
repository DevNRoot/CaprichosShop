import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/detalle-pre-ventas
 * Laravel: index()
 */
export async function GET() {
  const detalles = await prisma.detallePreVenta.findMany({
    orderBy: { id: "desc" },
  });

  return NextResponse.json(detalles);
}