import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/categorias
 * Laravel: index()
 */
export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      select: {
        id: true,
        nombre: true,
      },
    });

    return NextResponse.json(categorias);
  } catch (error) {
    return NextResponse.json(
      { mensaje: "Error al obtener categorías" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categorias
 * Laravel: guardado()
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre } = body;

    if (!nombre || typeof nombre !== "string") {
      return NextResponse.json(
        { mensaje: "El nombre es obligatorio" },
        { status: 422 }
      );
    }

    const categoria = await prisma.categoria.create({
      data: {
        nombre,
        estado: 1,
      },
    });

    return NextResponse.json(
      {
        mensaje: "Categoria guardada con éxito",
        categoria,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { mensaje: "Error al guardar categoría" },
      { status: 500 }
    );
  }
}