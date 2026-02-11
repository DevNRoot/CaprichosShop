"use client";

import { create } from "zustand";

export const useProductosStore = create((set) => ({
  productos: [],

  setProductos: (update) =>
    set((state) => ({
      productos:
        typeof update === "function"
          ? update(state.productos)
          : update,
    })),

  refrescarProductos: async () => {
    try {
      const res = await fetch("/api/productos");
      if (!res.ok) throw new Error("Error API");

      const data = await res.json();
      set({ productos: Array.isArray(data) ? data : [] });
    } catch (error) {
      console.error(" Error cargando productos:", error);
      set({ productos: [] });
    }
  },
}));