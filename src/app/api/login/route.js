import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/login
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, clave } = body;

    // ✅ Validación básica
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

    // 🔍 Buscar usuario (SIN mode: insensitive)
    const usuario = await prisma.Usuario.findFirst({
      where: {
        nombre: nombre, // ← CLAVE
        estado: 1,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // 🔐 Comparación directa (DEV)
    if (clave !== usuario.clave) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // ❌ Nunca devolver la clave
    const { clave: _, ...usuarioSeguro } = usuario;

    // ✅ Login OK
    return NextResponse.json(
      {
        message: "Login exitoso",
        usuario: usuarioSeguro,
        token: "fake-token-dev",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}