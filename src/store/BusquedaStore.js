"use client";
import { create } from "zustand";

export const useBusquedaStore = create((set) => ({
  textoBusqueda: "",
  setTextoBusqueda: (newValue) => set({ textoBusqueda: newValue }),
}));