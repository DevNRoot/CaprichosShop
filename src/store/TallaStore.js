"use client";  

import { create } from "zustand";
import APP_URL from "../config";

export const useTallaStore = create((set, get) => ({
  tallas: [],

  setTallas: (update) =>
    set((state) => ({
      tallas:
        typeof update === "function"
          ? update(state.tallas)
          : update,
    })),

  fetchTalla: async () => {
    try {
      const res = await fetch(`/api/tallas`);
      if (!res.ok) throw new Error("API no disponible");

      const data = await res.json();
      set({
        tallas: Array.isArray(data) ? data : [],
      });
    } catch (error) {
      console.warn(" Error cargando tallas:", error.message);
      set({ tallas: [] }); 
    }
  },

  actualizarTalla: async () => {
    try {
      const res = await fetch(`/api/tallas`);
      if (!res.ok) throw new Error("API no disponible");

      const data = await res.json();
      set({
        tallas: Array.isArray(data) ? data : [],
      });
    } catch (error) {
      console.warn(" Error actualizando tallas:", error.message);
      set({ tallas: [] });
    }
  },
}));