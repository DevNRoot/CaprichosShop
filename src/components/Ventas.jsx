"use client";

import React, { useEffect, useMemo, useState } from "react";
import Style from "./venta.module.css";

import GraficoTopProductos from "./GraficoTopProductos";
import MetodoPagoGrafico from "./MetodoPagoGrafico";
import GraficoLinealProducto from "./GraficoLinealProducto";
import NotaVentaPrint from "./NotaVentaPrint";

export default function Ventas({
  datosVenta = [],
  datosDetalleVenta = [],
  productos = [],
  tallas = [],
  colores = [],
  clientes = [],
  variantes = [],
}) {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [metodoSeleccionado, setMetodoSeleccionado] = useState("");
  const [montoDelDia, setMontoDelDia] = useState(0);
  const [gananciaLiquida, setGananciaLiquida] = useState(0);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  // ===============================
  // FECHAS INICIALES (PERÚ UTC-5)
  // ===============================
  useEffect(() => {
    const hoy = new Date().toLocaleDateString("en-CA", {
      timeZone: "America/Lima",
    });

    setFechaInicio(hoy);
    setFechaFin(hoy);
  }, []);

  // ===============================
  // HELPERS
  // ===============================
  const obtenerNombreProducto = id =>
    productos.find(p => p.id === id)?.nombre || "";

  const obtenerPrecioCompra = id =>
    productos.find(p => p.id === id)?.precioCompra || 0;

  const showNameCliente = id =>
    clientes.find(c => c.id === id)?.nombre || "";

  const obtenerVariante = id =>
    variantes.find(v => v.id === id);

  const obtenerNombreTallaPorVariante = varianteId => {
    const variante = obtenerVariante(varianteId);
    return tallas.find(t => t.id === variante?.tallaId)?.nombre || "-";
  };

  const obtenerNombreColorPorVariante = varianteId => {
    const variante = obtenerVariante(varianteId);
    return colores.find(c => c.id === variante?.colorId)?.nombre || "-";
  };

  // ===============================
  // FILTRADO DE VENTAS
  // ===============================
  const ventasFiltradas = useMemo(() => {
    return datosVenta
      .filter(v => {
        const fechaVenta = new Date(v.fecha).getTime();
        const desde = new Date(fechaInicio + "T00:00:00").getTime();
        const hasta = new Date(fechaFin + "T23:59:59").getTime();

        const metodoOK =
          !metodoSeleccionado ||
          v.metodoDePago?.includes(metodoSeleccionado);

        return fechaVenta >= desde && fechaVenta <= hasta && metodoOK;
      })
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [datosVenta, fechaInicio, fechaFin, metodoSeleccionado]);

  // ===============================
  // MONTO DEL DÍA
  // ===============================
  useEffect(() => {
    let total = 0;

    ventasFiltradas.forEach(v => {
      try {
        const metodos = JSON.parse(v.metodoDePago);
        if (metodoSeleccionado) {
          total += Number(metodos[metodoSeleccionado] || 0);
        } else {
          Object.values(metodos).forEach(m => {
            total += Number(m);
          });
        }
      } catch {}
    });

    setMontoDelDia(total);
  }, [ventasFiltradas, metodoSeleccionado]);

  // ===============================
  // GANANCIA LÍQUIDA
  // ===============================
  useEffect(() => {
    let totalGanancia = 0;

    ventasFiltradas.forEach(venta => {
      const detalles = datosDetalleVenta.filter(
        d => d.ventaId === venta.id
      );

      detalles.forEach(d => {
        const compra = obtenerPrecioCompra(d.productoId);
        totalGanancia += (d.precioUnitario - compra) * d.cantidad;
      });
    });

    setGananciaLiquida(totalGanancia);
  }, [ventasFiltradas, datosDetalleVenta, productos]);

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className={Style.contentPreVenta}>
      <h1 className={Style.tituloPreVentas}>Ventas</h1>

      {/* FILTROS FECHA */}
      <div className={Style.filtrosFechas}>
        <label>
          Desde:
          <input
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
          />
        </label>

        <label>
          Hasta:
          <input
            type="date"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
          />
        </label>
      </div>

      {/* MÉTODOS DE PAGO */}
      <div className={Style.filtroMetodosDePago}>
        {["Yape", "Tarjeta", "Efectivo"].map(m => (
          <label key={m}>
            <input
              type="radio"
              name="metodo"
              value={m}
              checked={metodoSeleccionado === m}
              onChange={e => setMetodoSeleccionado(e.target.value)}
            />
            {m}
          </label>
        ))}

        <label>
          <input
            type="radio"
            name="metodo"
            value=""
            checked={metodoSeleccionado === ""}
            onChange={() => setMetodoSeleccionado("")}
          />
          Todos
        </label>

        <span>MONTO DEL DÍA: S/ {montoDelDia}</span>
        <span>GANANCIA LÍQUIDA: S/ {gananciaLiquida.toFixed(2)}</span>
      </div>

      {/* GRÁFICOS */}
      <GraficoTopProductos
        ventasFiltradas={ventasFiltradas}
        datosDetalleVenta={datosDetalleVenta}
        productos={productos}
      />

      <MetodoPagoGrafico ventasFiltradas={ventasFiltradas} />

      <GraficoLinealProducto
        productos={productos}
        detalleVentas={datosDetalleVenta}
        ventasFiltradas={ventasFiltradas}
      />

      {/* TABLA */}
      <table className={Style.tablaGeneral}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Método</th>
            <th>Productos</th>
            <th>Nota</th>
          </tr>
        </thead>

        <tbody>
          {ventasFiltradas.map(venta => (
            <tr key={venta.id}>
              <td>{venta.fecha}</td>
              <td>{showNameCliente(venta.clienteId)}</td>
              <td>S/{venta.total}</td>
              <td>{venta.metodoDePago}</td>

              <td>
                <table className={Style.subTabla}>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Talla</th>
                      <th>Color</th>
                      <th>Precio</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {datosDetalleVenta
                      .filter(d => d.ventaId === venta.id)
                      .map((d, i) => (
                        <tr key={i}>
                          <td>{obtenerNombreProducto(d.productoId)}</td>
                          <td>{d.cantidad}</td>
                          <td>{obtenerNombreTallaPorVariante(d.varianteId)}</td>
                          <td>{obtenerNombreColorPorVariante(d.varianteId)}</td>
                          <td>S/{d.precioUnitario}</td>
                          <td>S/{d.total}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </td>

              <td>
                <button onClick={() => setVentaSeleccionada(venta)}>
                  Generar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {ventaSeleccionada && (
        <NotaVentaPrint
          venta={ventaSeleccionada}
          detalles={datosDetalleVenta.filter(
            d => d.ventaId === ventaSeleccionada.id
          )}
          showNameCliente={showNameCliente}
          obtenerNombreProducto={obtenerNombreProducto}
          obtenerNombreTallaPorVariante={obtenerNombreTallaPorVariante}
          obtenerNombreColorPorVariante={obtenerNombreColorPorVariante}
        />
      )}
    </div>
  );
}