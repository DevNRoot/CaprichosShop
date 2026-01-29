"use client";
import { create } from "zustand";

export const useBusquedaStore = create((set) => ({
  // búsqueda confirmada (Enter)
  textoBusqueda: "",
  setTextoBusqueda: (newValue) => set({ textoBusqueda: newValue }),

  // mientras escribe
  textoBusquedaTemporal: "",
  setTextoBusquedaTemporal: (newValue) =>
    set({ textoBusquedaTemporal: newValue }),

  // 👇 NUEVO: input activo (focus / teclado abierto)
  buscadorActivo: false,
  setBuscadorActivo: (value) =>
    set({ buscadorActivo: value }),
}));