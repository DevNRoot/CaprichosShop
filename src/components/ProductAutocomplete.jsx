"use client";

import Image from "next/image";

export default function ProductAutocomplete({
  estiloProductAutoComplete,
  estiloContainerImagen,
  estiloImagen,
  imagen,
  estiloContentDescripcion,
  estiloContentMarca,
  marca,
  estiloMarca,
  estiloContentNombre,
  nombre,
  estiloNombre,
  estiloContentPrecio,
  precio,
  estiloPrecio,
  estiloContentBoton,
  textoBoton,
  estiloBoton,
  estiloTextoBoton,
  eventoOnClick,
}) {
  return (
    <div className={estiloProductAutoComplete} onClick={eventoOnClick}>
      
      <div className={estiloContainerImagen}>
        <Image
          src={imagen || "/images/placeholder.jpg"}
          alt={nombre}
          className={estiloImagen}
          width={80}   // requerido por Next.js
          height={80}  // requerido por Next.js
        />
      </div>

      <div className={estiloContentDescripcion}>
        
        <div className={estiloContentMarca}>
          <span className={estiloMarca}>{marca}</span>
        </div>

        <div className={estiloContentNombre}>
          <span className={estiloNombre}>{nombre}</span>
        </div>

        <div className={estiloContentPrecio}>
          <span className={estiloPrecio}>{precio}</span>
        </div>

        <div className={estiloContentBoton}>
          <button className={estiloBoton}>
            <span className={estiloTextoBoton}>{textoBoton}</span>
          </button>
        </div>

      </div>
    </div>
  );
}