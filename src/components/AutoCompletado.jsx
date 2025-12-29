"use client";

import Style from "./autocompletado.module.css";
import StyleAutoComplete from "./productAutocomplete.module.css";
import ProductAutocomplete from "./ProductAutocomplete";

import { useContextoStore } from "../store/ContextoStore";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function Autocompletado({
  setShowAutoComplete,
  setTextoBusquedaTemporal,
  setProductosFiltrados,
}) {
  const productos = useContextoStore(
    (state) => state.productosFiltrados
  );
  const router = useRouter();

  /* =============================
     FILTRAR MARCAS ACTIVAS
  ============================= */
  const productosVisibles = useMemo(() => {
    return Array.isArray(productos)
      ? productos.filter(
          (p) => p.marca && p.marca.estado === 1
        )
      : [];
  }, [productos]);

  if (productosVisibles.length === 0) return null;

  return (
    <div className={Style.contentAutocompletado}>
      <div className={Style.containerProducts}>
        {productosVisibles.map((producto) => (
          <ProductAutocomplete
            key={producto.id}
            estiloProductAutoComplete={StyleAutoComplete.containerProductAuto}
            eventoOnClick={() => {
              router.push(`/detalle/${producto.id}`);
              setShowAutoComplete(false);
              setTextoBusquedaTemporal("");
              setProductosFiltrados([]);
            }}
            estiloContainerImagen={StyleAutoComplete.estiloContainerImagen}
            imagen={producto.imagen}
            estiloImagen={StyleAutoComplete.estiloImagen}
            estiloContentDescripcion={StyleAutoComplete.estiloContentDescripcion}
            estiloContentMarca={StyleAutoComplete.estiloContentMarca}
            marca={producto.marca?.nombre ?? ""}
            estiloMarca={StyleAutoComplete.estiloMarca}
            nombre={producto.nombre}
            estiloNombre={StyleAutoComplete.estiloNombre}
            precio={`S/. ${producto.precioVenta}`}
            estiloPrecio={StyleAutoComplete.estiloPrecio}
            estiloContentNombre={StyleAutoComplete.estiloContentNombre}
            estiloContentPrecio={StyleAutoComplete.estiloContentPrecio}
            estiloContentBoton={StyleAutoComplete.estiloContentBoton}
            textoBoton="AÑADIR AL CARRITO"
            estiloBoton={StyleAutoComplete.estiloBoton}
            estiloTextoBoton={StyleAutoComplete.estiloTextoBoton}
          />
        ))}
      </div>
    </div>
  );
}