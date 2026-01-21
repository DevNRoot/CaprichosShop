"use client";

import { create } from "zustand";
import APP_URL from "../config";

export const useExistenciaStore = create((set, get) => ({
  existencias: [],

  // Setter seguro
  setExistencias: (update) =>
    set((state) => ({
      existencias:
        typeof update === "function"
          ? update(state.existencias)
          : update,
    })),

  // Fetch inicial (solo una vez)
  fetchExistencias: async () => {
    try {
      const res = await fetch(`/api/variantes`);
      if (!res.ok) throw new Error("API no disponible");

      const data = await res.json();
      set({
        existencias: Array.isArray(data) ? data : [],
      });
    } catch (error) {
      console.warn("⚠️ Error cargando existencias:", error.message);
      set({ existencias: [] }); // fallback para evitar crashes
    }
  },

  // Actualización manual (sin doble fetch)
  actualizarExistencias: async () => {
    try {
      const res = await fetch(`/api/variantes`);
      if (!res.ok) throw new Error("API no disponible");

      const data = await res.json();
      set({
        existencias: Array.isArray(data) ? data : [],
      });
    } catch (error) {
      console.warn("⚠️ Error actualizando existencias:", error.message);
      set({ existencias: [] });
    }
  },
}));