"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Style from "./header.module.css";
import AutoCompletado from "./AutoCompletado";

import { useBusquedaStore } from "@/store/BusquedaStore";
import { useContextoStore } from "@/store/ContextoStore";
import { useLoginStore } from "@/store/LoginStore";
import { useMenuStore } from "@/store/MenuStore";
import { useCarritoStore } from "@/store/CarritoStore";
import { useUsuarioStore } from "@/store/UsuarioStore"; 

export default function Header() {
  const router = useRouter();

  // ===============================
  // USUARIO (ZUSTAND)
  // ===============================
  const usuario = useUsuarioStore((s) => s.usuario);
  const cerrarSesion = useUsuarioStore((s) => s.cerrarSesion);
  const cargarUsuario = useUsuarioStore((s) => s.cargarUsuario);

  // ===============================
  // STORES
  // ===============================
  const setTextoBusqueda = useBusquedaStore((s) => s.setTextoBusqueda);
  const setProductosFiltrados = useContextoStore(
    (s) => s.setProductosFiltrados
  );

  const abrirLogin = useLoginStore((s) => s.abrirLogin);
  const toggleMenu = useMenuStore((s) => s.toggleMenu);
  const abrirCarrito = useCarritoStore((s) => s.abrirCarrito);

  // ===============================
  // ESTADOS LOCALES
  // ===============================
  const [textoBusquedaTemporal, setTextoBusquedaTemporal] = useState("");
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [productos, setProductos] = useState([]);

  // ===============================
  // CARGAR USUARIO DESDE LOCALSTORAGE
  // ===============================
  useEffect(() => {
    cargarUsuario();
  }, [cargarUsuario]);

  // ===============================
  // FETCH PRODUCTOS
  // ===============================
  useEffect(() => {
    async function loadProductos() {
      try {
        const res = await fetch("/api/productos");
        if (!res.ok) throw new Error("Backend no disponible");
        const data = await res.json();
        setProductos(data);
      } catch {
        setProductos([]);
      }
    }
    loadProductos();
  }, []);

  // ===============================
  // BUSCADOR
  // ===============================
  const handleInputChange = (e) => {
    const valor = e.target.value;
    setTextoBusquedaTemporal(valor);
    setShowAutoComplete(true);

    const filtrados = productos.filter((p) =>
      p.nombre.toLowerCase().includes(valor.toLowerCase())
    );

    setProductosFiltrados(filtrados);
  };

  return (
    <header className={Style.contenedorHeader}>
      {/* LOGO + HAMBURGUESA */}
      <div className={Style.containerLogoHamburguesa}>
        <Image
          src="/images/caprichosLogoT.png"
          className={Style.logoIMG}
          alt="Caprichos Shop"
          width={90}
          height={90}
          priority
          onClick={() => router.push("/")}
        />

        {usuario && (
          <>
            <Image
              src="/images/Hamburguesa.png"
              className={Style.iconHamburguesa}
              alt="Menu"
              width={40}
              height={40}
              onClick={toggleMenu}
            />
            <span className={Style.menuLetra}>Menu</span>
          </>
        )}
      </div>

      {/* BUSCADOR */}
      <div className={Style.buscadorPrendas}>
        <input
          className={Style.inputBuscador}
          type="text"
          placeholder="¿Qué estás buscando?"
          value={textoBusquedaTemporal}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setTextoBusqueda(textoBusquedaTemporal);
              setShowAutoComplete(false);
              router.push("/catalogo/caballero");
              setTextoBusquedaTemporal("");
            }
            if (e.key === "Escape") setShowAutoComplete(false);
          }}
        />

        <div className={Style.containerBuscador}>
          <Image
            src="/images/lupa.png"
            className={Style.imgLupa}
            alt="Buscar"
            width={25}
            height={25}
          />
        </div>
      </div>

      {/* AUTOCOMPLETE */}
      {showAutoComplete && (
        <AutoCompletado
          setShowAutoComplete={setShowAutoComplete}
          setTextoBusquedaTemporal={setTextoBusquedaTemporal}
          setProductosFiltrados={setProductosFiltrados}
        />
      )}

      {/* OPCIONES DERECHA */}
      <div className={Style.contenedorHeaderOpciones}>
        {/* 🛒 CARRITO */}
        <Image
          src="/images/lastCarritoCompras.png"
          className={Style.iconCarrito}
          alt="Carrito"
          width={40}
          height={40}
          onClick={abrirCarrito}
          style={{ cursor: "pointer" }}
        />

        {/* USUARIO */}
        {usuario ? (
          <div className={Style.usuarioInfo}>
            <Image
              src="/images/userIconHeaderP.png"
              className={Style.iconUsuario}
              alt="Usuario"
              width={40}
              height={40}
              onClick={() => setMostrarMenuUsuario(!mostrarMenuUsuario)}
            />
            <span className={Style.nombreUsuario}>{usuario.nombre}</span>

            {mostrarMenuUsuario && (
              <div className={Style.menuUsuario}>
                <button
                  className={Style.botonCerrarSesion}
                  onClick={() => {
                    cerrarSesion();
                    setMostrarMenuUsuario(false);
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className={Style.btnIniciarSesion}
            onClick={abrirLogin}
          >
            Inicia Sesión
          </button>
        )}
      </div>
    </header>
  );
}