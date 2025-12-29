"use client";

import { useEffect, useState } from "react";
import Style from "./preVenta.module.css";

export default function PreVenta() {
  const [datosPreVenta, setDatosPreVenta] = useState([]);
  const [datosDetallePreVenta, setDatosDetallePreVenta] = useState([]);
  const [productos, setProductos] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [colores, setColores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [MPagosElegidos, setMPagosElegidos] = useState({});

  // 🔒 BLOQUEO ANTIDOBLE EJECUCIÓN
  const [procesando, setProcesando] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetch("/api/clientes").then(r => r.json()).then(setClientes);
    fetch("/api/productos").then(r => r.json()).then(setProductos);
    fetch("/api/tallas").then(r => r.json()).then(setTallas);
    fetch("/api/colores").then(r => r.json()).then(setColores);

    fetch("/api/pre-ventas")
      .then(r => r.json())
      .then(data =>
        setDatosPreVenta(
          data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        )
      );

    fetch("/api/detalle-pre-ventas")
      .then(r => r.json())
      .then(setDatosDetallePreVenta);
  }, []);

  /* ================= HELPERS ================= */
  const obtenerNombreProducto = id =>
    productos.find(p => p.id === id)?.nombre || "";

  const obtenerNombreTalla = id =>
    tallas.find(t => t.id === id)?.nombre || "";

  const obtenerNombreColor = id =>
    colores.find(c => c.id === id)?.nombre || "";

  const showNameCliente = id =>
    clientes.find(c => c.id === id)?.nombre || "";

  const formatearFecha = (fechaISO) =>
    new Date(fechaISO).toLocaleString("es-PE", {
      timeZone: "America/Lima",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  /* ================= MÉTODOS DE PAGO ================= */
  const handlePagoChange = (fecha, metodo, checked) => {
    setMPagosElegidos(prev => {
      const copia = { ...(prev[fecha] || {}) };
      checked ? (copia[metodo] = "") : delete copia[metodo];
      return { ...prev, [fecha]: copia };
    });
  };

  const handleMontoChange = (fecha, metodo, monto) => {
    setMPagosElegidos(prev => ({
      ...prev,
      [fecha]: {
        ...(prev[fecha] || {}),
        [metodo]: monto,
      },
    }));
  };

  /* ================= ELIMINAR PREVENTA ================= */
  const eliminarRegistro = async (id) => {
    if (procesando) return;
    if (!confirm("¿Eliminar esta pre-venta?")) return;

    setProcesando(true);
    try {
      const res = await fetch(`/api/pre-ventas/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("❌ No se pudo eliminar");
        return;
      }

      setDatosPreVenta(prev => prev.filter(v => v.id !== id));
      setDatosDetallePreVenta(prev =>
        prev.filter(d => d.preVentaId !== id)
      );
    } finally {
      setProcesando(false);
    }
  };

  /* ================= GUARDAR VENTA ================= */
  const guardarVenta = async (venta) => {
    if (procesando) return; // 🔒
    setProcesando(true);

    try {
      const pagos = MPagosElegidos[venta.fecha];

      if (!pagos || Object.keys(pagos).length === 0) {
        alert("Selecciona método de pago");
        return;
      }

      // ✅ VALIDACIÓN CORRECTA (ÚNICO CAMBIO)
      const sumaPagos = Object.values(pagos)
        .map(Number)
        .reduce((a, b) => a + b, 0);

      if (sumaPagos !== venta.total) {
        alert(
          `❌ El total es S/${venta.total} pero los pagos suman S/${sumaPagos}`
        );
        return;
      }

      const detalles = datosDetallePreVenta
        .filter(d => d.preVentaId === venta.id)
        .map(d => ({
          productoId: d.productoId,
          colorId: d.colorId,
          tallaId: d.tallaId,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
          subTotal: d.subTotal,
        }));

      const res = await fetch("/api/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total: venta.total,
          fecha: venta.fecha,
          metodo_de_pago: JSON.stringify(pagos),
          id_cliente: venta.clienteId,
          detalles,
        }),
      });

      if (!res.ok) {
        alert("❌ Error al registrar la venta");
        return;
      }

      await eliminarRegistro(venta.id);
      alert("✅ Venta confirmada y stock actualizado");
    } catch (error) {
      console.error(error);
      alert("❌ Error inesperado");
    } finally {
      setProcesando(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className={Style.contentPreVenta}>
      <h1 className={Style.tituloPreVentas}>Pre Ventas</h1>

      <table className={Style.tablaGeneral}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Productos</th>
          </tr>
        </thead>

        <tbody>
          {datosPreVenta.map(venta => (
            <tr key={venta.id}>
              <td>{formatearFecha(venta.fecha)}</td>
              <td>{showNameCliente(venta.clienteId)}</td>
              <td>S/{venta.total}</td>

              <td>
                <table className={Style.subTabla}>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Cantidad</th>
                      <th>Talla</th>
                      <th>Color</th>
                      <th>Precio</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosDetallePreVenta
                      .filter(d => d.preVentaId === venta.id)
                      .map((d, i) => (
                        <tr key={i}>
                          <td>{obtenerNombreProducto(d.productoId)}</td>
                          <td>{d.cantidad}</td>
                          <td>{obtenerNombreTalla(d.tallaId)}</td>
                          <td>{obtenerNombreColor(d.colorId)}</td>
                          <td>S/{d.precioUnitario}</td>
                          <td>S/{d.subTotal}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                <div className={Style.contentMetodoAddDelete}>
                  <div className={Style.metodoPago}>
                    <h3>Método de pago:</h3>

                    {["Yape", "Tarjeta", "Efectivo"].map(metodo => (
                      <div key={metodo}>
                        <label>
                          <input
                            type="checkbox"
                            checked={
                              MPagosElegidos[venta.fecha]?.[metodo] !== undefined
                            }
                            onChange={e =>
                              handlePagoChange(
                                venta.fecha,
                                metodo,
                                e.target.checked
                              )
                            }
                          />
                          {metodo}
                        </label>

                        {MPagosElegidos[venta.fecha]?.[metodo] !== undefined && (
                          <input
                            type="number"
                            value={MPagosElegidos[venta.fecha][metodo]}
                            onChange={e =>
                              handleMontoChange(
                                venta.fecha,
                                metodo,
                                e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className={Style.accionesPreVenta}>
                    <button disabled={procesando} onClick={() => guardarVenta(venta)}>
                      ✔
                    </button>
                    <button disabled={procesando} onClick={() => eliminarRegistro(venta.id)}>
                      🗑
                    </button>
                  </div>
                </div>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}