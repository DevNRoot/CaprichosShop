"use client";

import React, { createContext, useState, startTransition } from "react";

export const Contexto = createContext();

export const ContextoProvider = ({ children }) => {
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  const actualizarProductosFiltrados = (nuevosProductos) => {
    startTransition(() => {
      setProductosFiltrados(nuevosProductos);
    });
  };

  return (
    <Contexto.Provider
      value={{ productosFiltrados, setProductosFiltrados: actualizarProductosFiltrados }}
    >
      {children}
    </Contexto.Provider>
  );
};