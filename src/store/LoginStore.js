import { create } from "zustand";

export const useLoginStore = create((set) => ({
  mostrarLogin: false,
  abrirLogin:  () => set({ mostrarLogin: true }),
  cerrarLogin: () => set({ mostrarLogin: false }),
}));