"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Style from "./mantColor.module.css";

export default function MantColor() {
  const router = useRouter();
  const { id } = useParams(); 

  const [nombreColor, setNombreColor] = useState("");
  const [hexadecimal, setHexadecimal] = useState("");

  // CARGAR COLOR (EDICIÓN)
  
  useEffect(() => {
    if (!id) return;

    const cargarColor = async () => {
      try {
        const res = await fetch(`/api/colores/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("No encontrado");

        const data = await res.json();

        setNombreColor(data.nombre);
        setHexadecimal(data.hexadecimal);
      } catch (error) {
        console.error("Error al cargar color:", error);
      }
    };

    cargarColor();
  }, [id]);

  // GUARDAR
  
  const submitColor = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        id ? `/api/colores/${id}` : "/api/colores",
        {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: nombreColor,
            hexadecimal,
          }),
        }
      );

      if (!res.ok) throw new Error();

      alert(
        id
          ? " Color actualizado con éxito"
          : " Color registrado con éxito"
      );

      router.push("/FormColores");
    } catch {
      alert(" Error al guardar el color");
    }
  };

  return (
    <div className={Style.contentColor}>
      <h1 className={Style.titulo}>
        {id ? "Editar Color" : "Agregar Color"}
      </h1>

      <form className={Style.formulario} onSubmit={submitColor}>
        <div className={Style.divNombreColor}>
          <label>Nombre</label>
          <input
            className={Style.inputColores}
            value={nombreColor}
            onChange={(e) => setNombreColor(e.target.value)}
            required
          />
        </div>

        <div className={Style.divSelectColor}>
          <label>Hexadecimal</label>
          <input
            className={Style.inputColores}
            value={hexadecimal}
            onChange={(e) => setHexadecimal(e.target.value)}
            required
          />
        </div>

        <div className={Style.contentBotones}>
          <button type="submit" className={Style.btnGuardar}>
            Guardar Color
          </button>
          <button
            type="button"
            className={Style.btnGuardar}
            onClick={() => router.push("/FormColores")}
          >
            Ver Colores
          </button>
        </div>
      </form>
    </div>
  );
}