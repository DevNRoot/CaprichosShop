import Ventas from "@/components/Ventas";

export const dynamic = "force-dynamic";

async function getJSON(path) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL no está definido");
  }

  const res = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Error al obtener ${path}`);
  }

  return res.json();
}

export default async function Page() {
  const [
    datosVenta,
    datosDetalleVenta,
    productos,
    tallas,
    colores,
    clientes,
    variantes,
  ] = await Promise.all([
    getJSON("/api/ventas"),
    getJSON("/api/detalle-ventas"),
    getJSON("/api/productos"),
    getJSON("/api/tallas"),
    getJSON("/api/colores"),
    getJSON("/api/clientes"),
    getJSON("/api/variantes"),
  ]);

  return (
    <Ventas
      datosVenta={datosVenta}
      datosDetalleVenta={datosDetalleVenta}
      productos={productos}
      tallas={tallas}
      colores={colores}
      clientes={clientes}
      variantes={variantes}
    />
  );
}