import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req, { params }) {
  const { id } = await params; 
  const subCategoriaId = Number(id);

  if (isNaN(subCategoriaId)) {
    return NextResponse.json(
      { mensaje: "ID inválido" },
      { status: 400 }
    );
  }

  const subCategoria = await prisma.subCategoria.findUnique({
    where: { id: subCategoriaId },
  });

  if (!subCategoria) {
    return NextResponse.json(
      { mensaje: "SubCategoría no encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(subCategoria);
}