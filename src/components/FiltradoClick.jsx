"use client";

import { useState, useEffect } from 'react';
import Style from './filtradoClick.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost'; 

export default function FiltradoClick() {
  const [showGeneroData, setShowGeneroData] = useState(false);
  const [showCategoriaData, setShowCategoriaData] = useState(false);
  
  const [categorias, setCategorias] = useState([]);
  const [subCategorias, setSubCategorias] = useState([]);
  
  const [idCategoria, setIdCategoria] = useState('');
  const [subCategoriasFiltradas, setSubCategoriasFiltradas] = useState([]);
  
  const [generoElegido, setGeneroElegido] = useState('');
  const [categoriaElegida, setCategoriaElegida] = useState('');
  
  const router = useRouter();

  // Obtener categorías desde la API (se ejecuta solo una vez)
  useEffect(() => {
    fetch(`/api/categorias`)
      .then((response) => response.json())
      .then((data) => setCategorias(data))
      .catch((error) => console.error('Error al obtener categorías:', error));
  }, []);
  
  // Obtener subcategorías (se ejecuta solo una vez)
  useEffect(() => {
    fetch(`/api/subCategorias`)
      .then((response) => response.json())
      .then((data) => {
        setSubCategorias(data);
        // Filtrar subcategorías inmediatamente después de la carga inicial
        if (idCategoria) {
          const subCategoriaFiltro = data.filter(
            (subCategoria) => subCategoria.id_categorias === idCategoria
          );
          setSubCategoriasFiltradas(subCategoriaFiltro);
        }
      })
      .catch((error) => console.error('Error al obtener subcategorías:', error));
  }, [idCategoria]); // Filtramos solo cuando idCategoria cambia
  
  const handleShowGeneroData = () => setShowGeneroData(!showGeneroData);
  const handleShowCategoriaData = () => setShowCategoriaData(!showCategoriaData);

  const handleGoToFiltrado = () => {
    if (generoElegido && categoriaElegida) {
      router.push(`/catalogo/${generoElegido}/${categoriaElegida}`);
    } else if (generoElegido) {
      router.push(`/catalogo/${generoElegido}`);
    }
  };

  const goToCatalogo = () => {
    router.push(`/catalogo/caballero`);
  };

  return (
    <div className={Style.contentFiltradoClick}>
      <div className={Style.contentFirst}>
        <div className={Style.contentFiltrarPor}>
          <div className={Style.contentFiltradoTitulo}>
            <Image src={'/images/iconoFiltrado.png'} alt="filtrar" className={Style.iconoFiltrado} width={30} height={30}/>
            <span className={Style.tituloFiltrado}>Filtrar Por</span>
          </div>
          <div className={Style.contentFiltradoX} onClick={goToCatalogo}>
            <Image src={'/images/iconoX.png'} alt="cerrar" className={Style.iconoCerrar} width={30} height={30}/>
          </div>
        </div>

        {/* Género */}
        <div className={Style.contentGenero}>
          <span className={Style.textGenero}>GÉNERO</span>
          <Image
            src={'/images/iconoFlechaAbajo.png'}
            alt="Flecha"
            className={Style.imagenFlechaAbajo}
            onClick={handleShowGeneroData}
            width={30}
            height={30}
          />
        </div>

        {showGeneroData && (
          <div className={Style.ContentGeneroData}>
            {categorias.map((categoria) => (
              <div className="contentGeneroFiltro" key={categoria.id}>
                <input
                  type="radio"
                  name="filtroGenero"
                  id={`categoria-${categoria.id}`}
                  className="inputRadio"
                  onChange={() => {
                    setIdCategoria(categoria.id); // Cambiar la categoría seleccionada
                    const genero = categoria.id === 1 ? 'caballero' : 'dama';
                    setGeneroElegido(genero);
                  }}
                />
                <label htmlFor={`categoria-${categoria.id}`}>
                  {categoria.nombre}
                </label>
              </div>
            ))}
          </div>
        )}

        {/* Categoría */}
        <div className={Style.contentCategoria}>
          <span className={Style.textCategoria}>CATEGORÍA</span>
          <Image
            src={"/images/iconoFlechaAbajo.png"}
            alt="Flecha"
            className={Style.imagenFlechaAbajo}
            onClick={handleShowCategoriaData}
            width={30}
            height={30}
          />
        </div>

        {showCategoriaData && (
          <div className={Style.ContentGeneroData}>
            {subCategoriasFiltradas.map((subCategoria) => (
              <div className="contentGeneroFiltro" key={subCategoria.id}>
                <input
                  type="radio"
                  name="filtroCategoria"
                  id={`subcat-${subCategoria.id}`}
                  className="inputRadio"
                  onChange={() => setCategoriaElegida(subCategoria.id)}
                />
                <label htmlFor={`subcat-${subCategoria.id}`}>
                  {subCategoria.nombre}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={Style.contentSecond}>
        <button className={Style.btnAplicar} onClick={handleGoToFiltrado}>
          <span className={Style.spanAplicar}>APLICAR</span>
        </button>
      </div>
    </div>
  );
}