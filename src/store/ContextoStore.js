"use client";
import { create } from "zustand";

export const useContextoStore = create((set) => ({
  productosFiltrados: [],
  setProductosFiltrados: (newProduct) => set({ productosFiltrados: newProduct }),
}));