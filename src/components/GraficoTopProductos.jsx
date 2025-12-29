"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

export default function GraficoTopProductos({
  ventasFiltradas = [],
  datosDetalleVenta = [],
  productos = [],
}) {
  const productosVendidos = {};

  ventasFiltradas.forEach((venta) => {
    datosDetalleVenta
      .filter((detalle) => detalle.ventaId === venta.id)
      .forEach((detalle) => {
        const producto = productos.find(
          (p) => p.id === detalle.productoId
        );

        const nombre = producto?.nombre || "Desconocido";

        if (!productosVendidos[nombre]) {
          productosVendidos[nombre] = 0;
        }

        productosVendidos[nombre] += Number(detalle.cantidad);
      });
  });

  const dataOrdenada = Object.entries(productosVendidos)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad);

  const dataParaGrafico = dataOrdenada.slice(0, 10);

  return (
    <div>
      <h2>Top productos más vendidos</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical"
          data={dataParaGrafico}
          margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="nombre" />
          <Tooltip />

          <Bar dataKey="cantidad" fill="#8884d8">
            <LabelList dataKey="cantidad" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}