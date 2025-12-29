"use client";

import { createContext, useState, useEffect } from "react";

export const GlobalDataContext = createContext({
  colores: [],
  tallas: [],
  productos: [],
  loading: true,
});

export function GlobalDataProvider({ children }) {
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const [resColores, resTallas, resProductos] = await Promise.all([
          fetch("/api/colores"),
          fetch("/api/tallas"),
          fetch("/api/productos"),
        ]);

        const coloresData = resColores.ok ? await resColores.json() : [];
        const tallasData = resTallas.ok ? await resTallas.json() : [];
        const productosData = resProductos.ok ? await resProductos.json() : [];

        setColores(Array.isArray(coloresData) ? coloresData : []);

        // 🔥 CAMBIO IMPORTANTE AQUÍ
        setTallas(
          Array.isArray(tallasData)
            ? tallasData.filter((t) => t.estado === 1)
            : []
        );

        setProductos(Array.isArray(productosData) ? productosData : []);
      } catch (error) {
        console.error("❌ Error GlobalData:", error);
        setColores([]);
        setTallas([]);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalData();
  }, []);

  return (
    <GlobalDataContext.Provider
      value={{ colores, tallas, productos, loading }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
}