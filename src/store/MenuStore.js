import { create } from "zustand";

export const useMenuStore = create((set) => ({
  mostrarMenu: false,
  abrirMenu: () => set({ mostrarMenu: true }),
  cerrarMenu: () => set({ mostrarMenu: false }),
  toggleMenu: () =>
    set((state) => ({ mostrarMenu: !state.mostrarMenu })),
}));