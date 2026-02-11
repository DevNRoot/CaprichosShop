import { createContext, useState, useEffect } from 'react';
import API_URL from '../config';

export const ProductosContext = createContext();

export const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refrescarProductos();
  }, []);

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