import { createContext, useState } from "react";
import API_URL from "../config";

export const SubCategoriasContext = createContext();

export const SubCategoriasProvider = ({ children, initialSubCategorias }) => {
  const [subCategorias, setSubCategorias] = useState(initialSubCategorias);

  // Función para actualizar subcategorías en el cliente si es necesario
  const actualizarSubCategorias = async () => {
    try {
      const res = await fetch(`/api/subCategorias`);
      const data = await res.json();
      setSubCategorias(data);
    } catch (error) {
      console.error('Error al actualizar subcategorías:', error);
    }
  };

  return (
    <SubCategoriasContext.Provider
      value={{ subCategorias, setSubCategorias, actualizarSubCategorias }}
    >
      {children}
    </SubCategoriasContext.Provider>
  );
};

// Usamos getServerSideProps para obtener los datos en cada solicitud
export async function getServerSideProps() {
  try {
    const res = await fetch(`/api/subCategorias`);
    const subCategorias = await res.json();
    return { props: { initialSubCategorias: subCategorias } };
  } catch (error) {
    console.error('Error al obtener subcategorías:', error);
    return { props: { initialSubCategorias: [] } }; // Devuelve un array vacío en caso de error
  }
}