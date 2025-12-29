import { create } from "zustand";

export const useSubCategoriasStore = create((set) => ({
  subCategorias: [],

  setSubCategorias: (data) => set({ subCategorias: data }),

  actualizarSubCategorias: async () => {
    try {
      const res = await fetch("/api/subCategorias");
      const data = await res.json();
      set({ subCategorias: data });
    } catch (error) {
      console.error("Error al cargar subcategorías:", error);
    }
  },
}));