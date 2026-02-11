import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const detalles = await prisma.detallePreVenta.findMany({
    orderBy: { id: "desc" },
  });

  return NextResponse.json(detalles);
}