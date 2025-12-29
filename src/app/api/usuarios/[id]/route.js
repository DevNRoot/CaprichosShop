import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/usuarios/{id}
 * Laravel: obtenerUsuarios()
 */
export async function GET(_req, { params }) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json(
      { mensaje: "ID inválido" },
      { status: 400 }
    );
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: {
      id: true,
      nombre: true,
      cargo: true,
      // no devolvemos clave
    },
  });

  if (!usuario) {
    return NextResponse.json(
      { mensaje: "Usuario no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(usuario);
}