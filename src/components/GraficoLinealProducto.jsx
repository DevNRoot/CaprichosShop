"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function GraficoLinealProducto({
  productos = [],
  detalleVentas = [],
  ventasFiltradas = [],
}) {
  const [productoSeleccionado, setProductoSeleccionado] = useState("");

  // 🔹 SOLO detalles de ventas filtradas
  const detallesFiltrados = detalleVentas.filter((detalle) =>
    ventasFiltradas.some((venta) => venta.id === detalle.ventaId)
  );

  // 🔹 SOLO el producto seleccionado
  const detallesProducto = detallesFiltrados.filter(
    (detalle) => detalle.productoId === productoSeleccionado
  );

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];

  const dataPorFecha = {};

  detallesProducto.forEach((detalle) => {
    const venta = ventasFiltradas.find(
      (v) => v.id === detalle.ventaId
    );

    if (!venta?.fecha) return;

    const fecha = new Date(venta.fecha);
    const key = `${fecha.getFullYear()}-${fecha.getMonth()}`;

    if (!dataPorFecha[key]) {
      dataPorFecha[key] = {
        cantidad: 0,
        fecha,
      };
    }

    dataPorFecha[key].cantidad += Number(detalle.cantidad);
  });

  const dataParaGrafico = Object.values(dataPorFecha)
    .map(({ cantidad, fecha }) => ({
      periodo: `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`,
      cantidad,
      fechaOrden: fecha,
    }))
    .sort((a, b) => a.fechaOrden - b.fechaOrden);

  return (
    <div>
      <h2>Ventas por Producto en el Tiempo</h2>

      <select
        value={productoSeleccionado}
        onChange={(e) => setProductoSeleccionado(Number(e.target.value))}
      >
        <option value="">Selecciona un producto</option>
        {productos.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dataParaGrafico}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="periodo" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="cantidad"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}