"use client";

import { create } from "zustand";

export const useColorStore = create((set) => ({
  colores: [],

  setColores: (update) =>
    set((state) => ({
      colores:
        typeof update === "function"
          ? update(state.colores)
          : update,
    })),

  actualizarColores: async () => {
    try {
      const res = await fetch("/api/colores");
      const data = await res.json();

      set({
        colores: Array.isArray(data) ? data : [],
      });
    } catch (error) {
      console.warn("Error cargando colores");
      set({ colores: [] });
    }
  },
}));