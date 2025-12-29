"use client";

import { createContext, useState, useEffect, startTransition } from "react";
import API_URL from "../config";

export const ExistenciaContext = createContext();

export const ExistenciaProvider = ({ children }) => {
  const [existencias, setExistencias] = useState([]);

  // Función única para obtener existencias
  const fetchExistencias = async () => {
    try {
      const res = await fetch(`/api/variantes`);
      const data = await res.json();

      // React 18 safe update
      startTransition(() => {
        setExistencias(data);
      });
    } catch (error) {
      console.log("Error al obtener existencias:", error);
    }
  };

  // Para actualizar desde otros componentes
  const actualizarExistencias = async () => {
    await fetchExistencias();
  };

  // Cargar existencias al inicio
  useEffect(() => {
    fetchExistencias();
  }, []);

  return (
    <ExistenciaContext.Provider
      value={{ existencias, setExistencias, actualizarExistencias }}
    >
      {children}
    </ExistenciaContext.Provider>
  );
};