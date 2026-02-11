'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Style from './main.module.css'; 
import API_URL from '../config';
import Image from 'next/image';

export default function Main() {
  const [currentIndexWoman, setCurrentIndexWoman] = useState(0);
  const [currentIndexMan, setCurrentIndexMan] = useState(0);
  const [subcategoriasMan, setSubcategoriasMan] = useState([]);
  const [subcategoriasWoman, setSubcategoriasWoman] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/subCategorias`)
      .then(res => res.json())
      .then(data => {
        const hombres = data.filter(item => item.id_categorias === 1);
        const mujeres = data.filter(item => item.id_categorias === 2);
        setSubcategoriasMan(hombres);
        setSubcategoriasWoman(mujeres);
      })
      .catch(err => console.error('Error al obtener subcategorías:', err));
  }, []);

  const goToCatalogo = (genero, subcategoriaId = null) => {
    if (subcategoriaId) {
      router.push(`/catalogo/${genero}/${subcategoriaId}`);  
    } else {
      router.push(`/catalogo/${genero}`);  
    }
  };

  const handleLeftClick = (setIndex, currentIndex, items) => {
    setIndex(currentIndex === 0 ? items.length - 6 : currentIndex - 1); 
  };

  const handleRightClick = (setIndex, currentIndex, items) => {
    setIndex(currentIndex + 1 >= items.length - 5 ? 0 : currentIndex + 1); 
  };

  return (
    <div className={Style.contenedorMain}>
      {/* DAMAS */}
      <div className={Style.ContainerAllWoman}>
        <div
          className={Style.containerLefArrow}
          onClick={() => handleLeftClick(setCurrentIndexWoman, currentIndexWoman, subcategoriasWoman)}
        >
          <Image src='/images/leftArrow.png' className={Style.leftArrow} alt="Flecha izquierda" width={100} height={100}/>
        </div>

        <div className={Style.containerAll}>
          <div
            className={Style.containerImgWoman}
            onClick={() => goToCatalogo('dama')}
          >
            <h1 className={Style.viewAllWoman}>
              Explorar <br /> Todo
            </h1>
          </div>
          <span className={Style.subtituloIMG}>DAMAS</span>
        </div>

        {[...Array(6)].map((_, idx) => {
          const item = subcategoriasWoman[currentIndexWoman + idx];
          return (
            <div className={Style.containerWoman} key={idx}>
              <div
                className={Style.containerImgWoman}
                onClick={() => item && goToCatalogo('dama', item.id)}
              >
                {item ? (
                  <Image
                    src={`${API_URL}/storage/${item.imagen}` || '/images/placeholder.jpg'}
                    className={Style.imagenWoman}
                    alt={item.nombre || 'Imagen de categoría'}
                    width={200}  
                    height={200}  
                  />
                ) : (
                  <div className={Style.placeholder}></div>
                )}
              </div>
              <span className={Style.subtituloIMGSubCategoria}>
                {item ? item.nombre : ''}
              </span>
            </div>
          );
        })}

        <div
          className={Style.containerRightArrow}
          onClick={() => handleRightClick(setCurrentIndexWoman, currentIndexWoman, subcategoriasWoman)}
        >
          <Image src='/images/rightArrow.png' className={Style.RightArrow} alt="Flecha derecha" width={100} height={100}/>
        </div>
      </div>

      {/* CABALLEROS */}
      <div className={Style.ContainerAllMan}>
        <div
          className={Style.containerLefArrow}
          onClick={() => handleLeftClick(setCurrentIndexMan, currentIndexMan, subcategoriasMan)}
        >
          <Image src='/images/leftArrow.png' className={Style.leftArrow} alt="Flecha izquierda" width={100} height={100}/>
        </div>

        <div className={Style.containerAll}>
          <div
            className={Style.containerImgMan}
            onClick={() => goToCatalogo('caballero')}
          >
            <h1 className={Style.viewAllMan}>
              Explorar <br /> Todo
            </h1>
          </div>
          <span className={Style.subtituloIMG}>CABALLEROS</span>
        </div>

        {[...Array(6)].map((_, idx) => {
          const item = subcategoriasMan[currentIndexMan + idx];
          return (
            <div className={Style.containerMan} key={idx}>
              <div
                className={Style.containerImgMan}
                onClick={() => item && goToCatalogo('caballero', item.id)}
              >
                {item ? (
                  <Image
                    src={`${API_URL}/storage/${item.imagen}` || '/images/placeholder.jpg'}
                    className={Style.imagenWoman}
                    alt={item.nombre || 'Imagen de categoría'}
                    width={200}  
                    height={200}  
                  />
                ) : (
                  <div className={Style.placeholder}></div>
                )}
              </div>
              <span className={Style.subtituloIMGSubCategoria}>
                {item ? item.nombre : ''}
              </span>
            </div>
          );
        })}

        <div
          className={Style.containerRightArrow}
          onClick={() => handleRightClick(setCurrentIndexMan, currentIndexMan, subcategoriasMan)}
        >
          <Image src='/images/rightArrow.png' className={Style.RightArrow} alt="Flecha derecha" width={100} height={100}/>
        </div>
      </div>
    </div>
  );
}