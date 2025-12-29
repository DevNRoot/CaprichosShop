import { createContext, useState, useEffect } from 'react';
import API_URL from '../config';

export const ProductosContext = createContext();

export const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Si prefieres cargar los productos solo cuando se renderiza en el cliente, usa useEffect
  useEffect(() => {
    refrescarProductos();
  }, []);

  // Función para refrescar productos
  const refrescarProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/productos`);
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("❌ Error al refrescar productos:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductosContext.Provider
      value={{ productos, setProductos, loading, refrescarProductos }}
    >
      {children}
    </ProductosContext.Provider>
  );
};