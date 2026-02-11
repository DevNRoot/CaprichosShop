"use client";

import Image from "next/image";
import styles from "./card.module.css";

const PLACEHOLDER = "/images/placeholder.jpg";

function normalizarImagen(src) {
  if (!src) return PLACEHOLDER;

  // URL completa (Cloudinary)
  if (src.startsWith("http")) {
    return src;
  }

  if (!src.startsWith("/")) {
    return `/${src}`;
  }

  return src;
}

export default function Card({
  imagenCatalogo,
  nombre,
  precio,
  marca,
  onClick,
}) {
  return (
    <div className={styles.contentCard} onClick={onClick}>
      <Image
        src={normalizarImagen(imagenCatalogo)}
        alt={nombre}
        width={232}
        height={232}
        className={styles.imagenCatalogo}
      />

      <div className={styles.estiloDivNombrePrecio}>
        <h1 className={styles.marca}>{marca}</h1>
        <h1 className={styles.nombre}>{nombre}</h1>
        <span className={styles.precio}>{precio}</span>
      </div>

      <div className={styles.estiloContenedorDelMas}>
        <span className={styles.estiloSpanMas}>
          AÑADIR AL CARRITO
        </span>
      </div>
    </div>
  );
}