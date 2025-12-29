import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const colores = await prisma.color.findMany();
    return NextResponse.json(colores);
  } catch (error) {
    return NextResponse.json(
      { mensaje: "Error al obtener colores" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, hexadecimal } = body;

    if (!nombre) {
      return NextResponse.json(
        { mensaje: "Nombre obligatorio" },
        { status: 422 }
      );
    }

    const color = await prisma.color.create({
      data: {
        nombre,
        hexadecimal: hexadecimal || null,
        estado: 1, // ✅ SIEMPRE ACTIVO
      },
    });

    return NextResponse.json(color, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { mensaje: "Error al guardar color" },
      { status: 500 }
    );
  }
}