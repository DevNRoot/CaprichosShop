import { create } from "zustand";

export const useMarcaStore = create((set, get) => ({
  marcas: [],

  actualizarMarcas: async () => {
    const res = await fetch("/api/marcas", { cache: "no-store" });
    const data = await res.json();
    set({ marcas: Array.isArray(data) ? data : [] });
  },

  cambiarEstadoMarca: async (idMarca, estadoActual) => {
    const nuevoEstado = estadoActual === 1 ? 0 : 1;

    set({
      marcas: get().marcas.map((m) =>
        m.idMarca === idMarca ? { ...m, estado: nuevoEstado } : m
      ),
    });

    const res = await fetch(`/api/marcas/${idMarca}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });

    if (!res.ok) {
      console.error("No se pudo actualizar estado en backend");

      set({
        marcas: get().marcas.map((m) =>
          m.idMarca === idMarca
            ? { ...m, estado: estadoActual }
            : m
        ),
      });
    }
  },
}));