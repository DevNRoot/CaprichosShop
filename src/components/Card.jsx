"use client";

import Image from "next/image";
import styles from "./card.module.css";

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
        src={imagenCatalogo || "/images/placeholder.jpg"}
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