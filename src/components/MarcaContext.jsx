import { createContext, useState, useEffect } from "react";
import API_URL from "../config";

export const MarcaContext = createContext();

export const MarcaProvider = ({ children }) => {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener las marcas
  const obtenerMarcas = async () => {
    try {
      const res = await fetch(`/api/marcas`);
      const data = await res.json();
      
      // Verifica si los datos son diferentes antes de actualizar el estado
      if (JSON.stringify(data) !== JSON.stringify(marcas)) {
        setMarcas(data);
      }
    } catch (error) {
      console.error("Error al obtener marcas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Llamamos a obtenerMarcas cuando el componente se monta
  useEffect(() => {
    obtenerMarcas();
  }, []);  // Solo se ejecuta una vez cuando el componente se monta

  return (
    <MarcaContext.Provider value={{ marcas, setMarcas, obtenerMarcas, loading }}>
      {children}
    </MarcaContext.Provider>
  );
};