"use client";

import Header from "@/components/Header";
import Login from "@/components/Login";
import Menu from "@/components/Menu";
import Carrito from "@/components/Carrito";

import { useLoginStore } from "@/store/LoginStore";
import { useMenuStore } from "@/store/MenuStore";
import { useCarritoStore } from "@/store/CarritoStore";

export default function ClientLayout({ children }) {
  const mostrarLogin = useLoginStore((s) => s.mostrarLogin);
  const cerrarLogin = useLoginStore((s) => s.cerrarLogin);

  const mostrarMenu = useMenuStore((s) => s.mostrarMenu);
  const cerrarMenu = useMenuStore((s) => s.cerrarMenu);

  const mostrarCarrito = useCarritoStore((s) => s.mostrarCarrito);
  const cerrarCarrito = useCarritoStore((s) => s.cerrarCarrito);

  const productos = useCarritoStore((s) => s.productos);
  const eliminarProducto = useCarritoStore((s) => s.eliminarProducto);
  const actualizarProducto = useCarritoStore((s) => s.actualizarProducto);
  const vaciarCarrito = useCarritoStore((s) => s.vaciarCarrito);

  return (
    <>
      <Header />

      {mostrarMenu && (
        <>
          <div
            onClick={cerrarMenu}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1200,
            }}
          />
          <Menu />
        </>
      )}

      <main>{children}</main>

      {mostrarCarrito && (
        <>
          {/* OVERLAY */}
          <div
            onClick={cerrarCarrito}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1000, 
            }}
          />

          {/* CARRITO */}
          <Carrito />
        </>
      )}

      {mostrarLogin && (
        <>
          <div
            onClick={cerrarLogin}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1500,
            }}
          />
          <Login />
        </>
      )}
    </>
  );
}