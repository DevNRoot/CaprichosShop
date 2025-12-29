"use client";

import Style from "./notaVentaPrint.module.css";

export default function NotaVentaPrint({
  venta,
  detalles = [],
  showNameCliente,
  obtenerNombreProducto,
  obtenerNombreTallaPorVariante,
  obtenerNombreColorPorVariante,
}) {
  const handlePrint = () => {
    window.print();
  };

  if (!venta) return null;

  return (
    <div className={Style.contentNotaVenta}>
      <h2 className={Style.titulo}>NOTA DE VENTA</h2>

      <p>
        <strong>Fecha:</strong> {venta.fecha}
      </p>

      <p>
        <strong>Cliente:</strong> {showNameCliente(venta.clienteId)}
      </p>

      <div className={Style.linea}></div>

      {detalles.map((item, index) => (
        <div key={index} className={Style.detalles}>
          <p>
            <strong>Producto:</strong>{" "}
            {obtenerNombreProducto(item.productoId)}
          </p>

          <p>
            <strong>Cantidad:</strong> {item.cantidad}
          </p>

          <p>
            <strong>Talla:</strong>{" "}
            {obtenerNombreTallaPorVariante(item.varianteId)}
          </p>

          <p>
            <strong>Color:</strong>{" "}
            {obtenerNombreColorPorVariante(item.varianteId)}
          </p>

          <p>
            <strong>Precio Unitario:</strong> S/{item.precioUnitario}
          </p>

          <p>
            <strong>Subtotal:</strong> S/{item.total}
          </p>

          <div className={Style.linea}></div>
        </div>
      ))}

      <p>
        <strong>Total Venta:</strong> S/{venta.total}
      </p>

      <button onClick={handlePrint} className={Style.btnImprimirNota}>
        Imprimir Nota Venta
      </button>
    </div>
  );
}