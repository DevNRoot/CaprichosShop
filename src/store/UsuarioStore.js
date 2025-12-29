"use client"; 

import { create } from "zustand";

export const useUsuarioStore = create((set) => ({
  usuario: null, // inicial seguro sin crashear

  // Cargar usuario desde localStorage (solo en client)
  cargarUsuario: () => {
    try {
      if (typeof window !== "undefined") {
        const usuarioGuardado = localStorage.getItem("usuario");
        if (usuarioGuardado) {
          set({ usuario: JSON.parse(usuarioGuardado) });
        }
      }
    } catch {
      localStorage.removeItem("usuario");
      set({ usuario: null });
    }
  },

  iniciarSesion: (datosUsuario) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("usuario", JSON.stringify(datosUsuario));
      }
    } catch {}
    set({ usuario: datosUsuario });
  },

  cerrarSesion: () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
      }
    } catch {}
    set({ usuario: null });
  },
}));