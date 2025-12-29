import { create } from "zustand";

export const useCarritoStore = create((set) => ({
  mostrarCarrito: false,
  productos: [],

  abrirCarrito: () => set({ mostrarCarrito: true }),
  cerrarCarrito: () => set({ mostrarCarrito: false }),

  agregarProducto: (producto) =>
    set((state) => ({
      productos: [...state.productos, producto],
      mostrarCarrito: true,
    })),

  eliminarProducto: (index) =>
    set((state) => ({
      productos: state.productos.filter((_, i) => i !== index),
    })),

  actualizarProducto: (index, nuevoProducto) =>
    set((state) => ({
      productos: state.productos.map((p, i) =>
        i === index ? nuevoProducto : p
      ),
    })),

  vaciarCarrito: () => set({ productos: [] }),
}));