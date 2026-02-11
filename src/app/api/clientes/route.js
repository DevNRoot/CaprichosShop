import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  const clientes = await prisma.cliente.findMany({
    select: {
      id: true,
      nombre: true,
      documento: true,
    },
  });

  return NextResponse.json(clientes);
}


export async function POST(req) {
  const body = await req.json();
  const { nombre, documento } = body;

  if (!nombre || !documento) {
    return NextResponse.json(
      { message: "Nombre y documento son obligatorios" },
      { status: 422 }
    );
  }

  const cliente = await prisma.cliente.create({
    data: {
      nombre,
      documento,
    },
  });

  return NextResponse.json(cliente, { status: 201 });
}