import { createContext, useState, useEffect } from "react";

// Aquí solo gestionamos el estado, no necesitamos hacer fetch aquí
export const TallaContext = createContext();

export const TallaProvider = ({ children, initialTallas }) => {
  const [tallas, setTallas] = useState(initialTallas);

  const actualizarTalla = async () => {
    try {
      const res = await fetch(`/api/tallas`);
      const data = await res.json();
      setTallas(data);
    } catch (error) {
      console.error("Error al actualizar tallas:", error);
    }
  };

  return (
    <TallaContext.Provider value={{ tallas, setTallas, actualizarTalla }}>
      {children}
    </TallaContext.Provider>
  );
};