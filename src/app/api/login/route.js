import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, clave } = body;

    if (
      !nombre ||
      typeof nombre !== "string" ||
      !clave ||
      typeof clave !== "string"
    ) {
      return NextResponse.json(
        { message: "nombre y clave son obligatorios" },
        { status: 422 }
      );
    }

    const usuario = await prisma.Usuario.findFirst({
      where: {
        nombre: nombre
        // estado: 1,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    if (clave !== usuario.clave) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const { clave: _, ...usuarioSeguro } = usuario;

    return NextResponse.json(
      {
        message: "Login exitoso",
        usuario: usuarioSeguro,
        token: "fake-token-dev",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(" LOGIN ERROR COMPLETO ");
  console.error(error);
  console.error("message:", error?.message);
  console.error("stack:", error?.stack);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}