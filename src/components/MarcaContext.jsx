import { createContext, useState, useEffect } from "react";
import API_URL from "../config";

export const MarcaContext = createContext();

export const MarcaProvider = ({ children }) => {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerMarcas = async () => {
    try {
      const res = await fetch(`/api/marcas`);
      const data = await res.json();
      
      if (JSON.stringify(data) !== JSON.stringify(marcas)) {
        setMarcas(data);
      }
    } catch (error) {
      console.error("Error al obtener marcas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerMarcas();
  }, []);  

  return (
    <MarcaContext.Provider value={{ marcas, setMarcas, obtenerMarcas, loading }}>
      {children}
    </MarcaContext.Provider>
  );
};