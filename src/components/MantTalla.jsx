"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Style from "./mantTalla.module.css";

export default function MantTalla() {
  const router = useRouter();
  const { id } = useParams(); // ✅ CORRECTO

  const [guardarTalla, setGuardarTalla] = useState("");

  // ===============================
  // CARGAR TALLA (EDICIÓN)
  // ===============================
  useEffect(() => {
    if (!id) return;

    const cargarTalla = async () => {
      try {
        const res = await fetch(`/api/tallas/${id}`);
        if (!res.ok) throw new Error();

        const data = await res.json();
        setGuardarTalla(data?.nombre ?? "");
      } catch (error) {
        console.error("Error al obtener la talla:", error);
        setGuardarTalla("");
      }
    };

    cargarTalla();
  }, [id]);

  // ===============================
  // GUARDAR
  // ===============================
  const submitNombresTalla = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        id ? `/api/tallas/${id}` : "/api/tallas",
        {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: guardarTalla }),
        }
      );

      if (!res.ok) throw new Error();

      alert(
        id
          ? "✅ Talla actualizada con éxito"
          : "✅ Talla registrada con éxito"
      );

      router.push("/FormTalla");
    } catch {
      alert("❌ Error al guardar la talla");
    }
  };

  return (
    <div className={Style.contentTalla}>
      <h1 className={Style.titulo}>
        {id ? "Editar Talla" : "Agregar Talla"}
      </h1>

      <form className={Style.formulario} onSubmit={submitNombresTalla}>
        <div className={Style.divTallas}>
          <label>Talla:</label>
          <input
            className={Style.inputTallas}
            type="text"
            value={guardarTalla}
            onChange={(e) => setGuardarTalla(e.target.value)}
            required
          />
        </div>

        <div className={Style.contentBotones}>
          <button type="submit" className={Style.btnGuardar}>
            Guardar Talla
          </button>
          <button
            type="button"
            className={Style.btnGuardar}
            onClick={() => router.push("/FormTalla")}
          >
            Ver Tallas
          </button>
        </div>
      </form>
    </div>
  );
}