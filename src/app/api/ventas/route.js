import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const {
      fecha,
      total,
      metodo_de_pago,
      id_cliente,
      detalles,
      preVentaId,
    } = await req.json();

    if (
      !fecha ||
      total === undefined ||
      !metodo_de_pago ||
      !id_cliente ||
      !preVentaId ||
      !Array.isArray(detalles) ||
      detalles.length === 0
    ) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 422 });
    }

    // 1️⃣ Crear venta (FUERA de los detalles)
    const venta = await prisma.venta.create({
      data: {
        fecha: new Date(fecha),
        total,
        metodoDePago: metodo_de_pago,
        clienteId: Number(id_cliente),
      },
    });

    // 2️⃣ Crear detalles + actualizar stock (en orden)
    for (const d of detalles) {
      const productoId = Number(d.productoId);
      const colorId = Number(d.colorId);
      const tallaId = Number(d.tallaId);
      const cantidad = Number(d.cantidad);

      const variante = await prisma.variante.findFirst({
        where: { productoId, colorId, tallaId },
      });

      if (!variante) throw new Error("Variante no encontrada");
      if (variante.stock < cantidad) throw new Error("Stock insuficiente");

      await prisma.variante.update({
        where: { id: variante.id },
        data: { stock: { decrement: cantidad } },
      });

      await prisma.detalleVenta.create({
        data: {
          ventaId: venta.id,        // ✅ YA EXISTE
          productoId,
          varianteId: variante.id,
          cantidad,
          precioUnitario: d.precioUnitario,
          total: d.subTotal,
        },
      });
    }

    // 3️⃣ Eliminar preventa
    await prisma.detallePreVenta.deleteMany({
      where: { preVentaId: Number(preVentaId) },
    });

    await prisma.preVenta.delete({
      where: { id: Number(preVentaId) },
    });

    return NextResponse.json(
      { message: "Venta registrada correctamente", ventaId: venta.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ ERROR VENTA:", error);
    return NextResponse.json(
      { error: "Error al registrar la venta", detail: error.message },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const ventas = await prisma.venta.findMany({
      orderBy: { id: "desc" },
      include: {
        cliente: true,
        detalleVentas: {
          include: {
            producto: true,
            variante: {
              include: { color: true, talla: true },
            },
          },
        },
      },
    });

    return NextResponse.json(ventas);
  } catch (error) {
    console.error("❌ ERROR GET VENTAS:", error);
    return NextResponse.json(
      { error: "Error al obtener ventas", detail: error.message },
      { status: 500 }
    );
  }
}