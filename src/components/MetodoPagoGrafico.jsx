"use client";

import React, { useEffect, useState } from "react";
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

export default function MetodoPagoGrafico({ ventasFiltradas = [] }) {
  const [valores, setValores] = useState({
    Yape: 0,
    Tarjeta: 0,
    Efectivo: 0,
  });

  const [montos, setMontos] = useState({
    Yape: 0,
    Tarjeta: 0,
    Efectivo: 0,
  });

  useEffect(() => {
    let contador = {
      Yape: 0,
      Tarjeta: 0,
      Efectivo: 0,
    };

    let total = {
      Yape: 0,
      Tarjeta: 0,
      Efectivo: 0,
    };

    ventasFiltradas.forEach((venta) => {
      try {
        const metodos = JSON.parse(venta.metodoDePago || "{}");

        Object.keys(metodos).forEach((metodo) => {
          contador[metodo] += 1;
          total[metodo] += Number(metodos[metodo]);
        });
      } catch (e) {
        console.error("Error parseando método de pago:", venta.metodoDePago);
      }
    });

    setValores(contador);
    setMontos(total);
  }, [ventasFiltradas]);

  const dataParaGrafico = [
    { nombre: "Yape", montos: montos.Yape, cantidad: valores.Yape },
    { nombre: "Tarjeta", montos: montos.Tarjeta, cantidad: valores.Tarjeta },
    { nombre: "Efectivo", montos: montos.Efectivo, cantidad: valores.Efectivo },
  ].sort((a, b) => b.montos - a.montos);

  return (
    <div>
      <h2>Top Métodos de Pago Más Usados</h2>

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

          <Bar dataKey="montos" fill="#8884d8" name="Monto">
            <LabelList dataKey="montos" position="right" />
          </Bar>

          <Bar dataKey="cantidad" fill="#82ca9d" name="Veces usado">
            <LabelList dataKey="cantidad" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}