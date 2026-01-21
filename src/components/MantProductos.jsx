"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Style from "./mantProductos.module.css";

export default function MantProductos() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ?? null;

  // ===============================
  // ESTADOS
  // ===============================
  const [categorias, setCategorias] = useState([]);
  const [subCategorias, setSubCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [subCategoriaFiltrada, setSubCategoriaFiltrada] = useState([]);

  const [idSubCategorias, setIdSubCategorias] = useState("");
  const [idMarca, setIdMarca] = useState("");
  const [nombre, setNombre] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [imagen, setImagen] = useState(null);

  // SOLO PARA EDICIÓN
  const [nombreCategoriaEdit, setNombreCategoriaEdit] = useState("");
  const [nombreSubCategoriaEdit, setNombreSubCategoriaEdit] = useState("");
  const [nombreMarcaEdit, setNombreMarcaEdit] = useState("");

  // ===============================
  // CARGAR DATA BASE
  // ===============================
  useEffect(() => {
    Promise.all([
      fetch("/api/categorias").then(r => r.json()),
      fetch("/api/subCategorias").then(r => r.json()),
      fetch("/api/marcas").then(r => r.json()),
    ]).then(([cat, sub, mar]) => {
      setCategorias(cat);
      setSubCategorias(sub);
      setMarcas(mar);
    });
  }, []);

  // ===============================
  // CARGAR PRODUCTO (EDITAR)
  // ===============================
  useEffect(() => {
    if (!id) return;

    const cargarProducto = async () => {
      const res = await fetch(`/api/productos/${id}`);
      if (!res.ok) return;

      const data = await res.json();

      setNombre(data.nombre ?? "");
      setPrecioCompra(String(data.precioCompra ?? ""));
      setPrecioVenta(String(data.precioVenta ?? ""));
      setIdSubCategorias(String(data.subCategoriaId ?? ""));
      setIdMarca(String(data.marcaId ?? ""));

      setNombreSubCategoriaEdit(data.subCategoria?.nombre ?? "");
      setNombreCategoriaEdit(
        data.subCategoria?.categoria?.nombre ?? ""
      );
      setNombreMarcaEdit(data.marca?.nombre ?? "");
    };

    cargarProducto();
  }, [id]);

  // ===============================
  // FILTRAR SUBCATEGORÍAS
  // ===============================
  const manejoCategoriaFiltro = (e) => {
    const idCategoria = Number(e.target.value);

    const filtradas = subCategorias.filter(
      sc => sc.categoriaId === idCategoria
    );

    setSubCategoriaFiltrada(filtradas);
    setIdSubCategorias("");
  };

  // ===============================
  // GUARDAR / ACTUALIZAR PRODUCTO
  // ===============================
  const submitProductos = async (e) => {
    e.preventDefault();

    if (!idSubCategorias) {
      alert("❌ Debes seleccionar una subcategoría");
      return;
    }

    if (!idMarca) {
      alert("❌ Debes seleccionar una marca");
      return;
    }

    const formData = new FormData();
    formData.append("id_sub_categorias", idSubCategorias);
    formData.append("id_marca", idMarca);
    formData.append("nombre", nombre);
    formData.append("precio_compra", precioCompra);
    formData.append("precio_venta", precioVenta);

    if (imagen) formData.append("imagen", imagen);

    const res = await fetch(
      id ? `/api/productos/${id}` : "/api/productos",
      {
        method: id ? "PUT" : "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error(err);
      alert("❌ Error al guardar producto");
      return;
    }

    alert(id ? "✅ Producto actualizado" : "✅ Producto agregado");
    router.push("/FormProductos");
  };

  // ===============================
  // NAVEGACIÓN EXISTENCIA
  // ===============================
  const irAMantenimientoExistencia = () => {
    router.push("/MantExistencia");
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className={Style.mantProductos}>
      <h1 className={Style.titulo}>
        {id ? "EDITAR PRODUCTO" : "AGREGAR PRODUCTO"}
      </h1>

      <form className={Style.formulario} onSubmit={submitProductos}>

        {/* CATEGORIA */}
        <div className={Style.divCategoria}>
          <label>Categoría</label>
          {!id ? (
            <select
              className={Style.selectCategoria}
              onChange={manejoCategoriaFiltro}
              required
            >
              <option value="">Seleccionar</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          ) : (
            <select className={Style.selectCategoria} disabled>
              <option>{nombreCategoriaEdit}</option>
            </select>
          )}
        </div>

        {/* SUBCATEGORIA */}
        <div className={Style.divSubCategoria}>
          <label>Subcategoría</label>
          {!id ? (
            <select
              className={Style.selectSubCategoria}
              value={idSubCategorias}
              onChange={e => setIdSubCategorias(e.target.value)}
              required
            >
              <option value="">Seleccionar</option>
              {subCategoriaFiltrada.map(sc => (
                <option key={sc.id} value={sc.id}>
                  {sc.nombre}
                </option>
              ))}
            </select>
          ) : (
            <select className={Style.selectSubCategoria} disabled>
              <option>{nombreSubCategoriaEdit}</option>
            </select>
          )}
        </div>

        {/* MARCA */}
        <div className={Style.divCategoria}>
          <label>Marca</label>
          {!id ? (
            <select
              className={Style.selectCategoria}
              value={idMarca}
              onChange={e => setIdMarca(e.target.value)}
              required
            >
              <option value="">Seleccionar</option>
              {marcas.map(m => (
                <option key={m.idMarca} value={m.idMarca}>
                  {m.nombre}
                </option>
              ))}
            </select>
          ) : (
            <select className={Style.selectCategoria} disabled>
              <option>{nombreMarcaEdit}</option>
            </select>
          )}
        </div>

        {/* PRODUCTO */}
        <div className={Style.divProducto}>
          <label>Producto</label>
          <input
            className={Style.inputProducto}
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
        </div>

        <div className={Style.divPrecioCompra}>
          <label>Precio Compra</label>
          <input
            className={Style.inputProducto}
            type="number"
            value={precioCompra}
            onChange={e => setPrecioCompra(e.target.value)}
            required
          />
        </div>

        <div className={Style.divPrecioVenta}>
          <label>Precio Venta</label>
          <input
            className={Style.inputProducto}
            type="number"
            value={precioVenta}
            onChange={e => setPrecioVenta(e.target.value)}
            required
          />
        </div>

        <div className={Style.divImagen}>
          <label>Imagen</label>
          <input
            className={Style.inputImagen}
            type="file"
            onChange={e => setImagen(e.target.files[0])}
          />
        </div>

        {/* BOTONES */}
        <div className={Style.divBotones}>
          <button className={Style.btnAgregarProducto} type="submit">
            {id ? "Actualizar Producto" : "Agregar Producto"}
          </button>

          <button
            type="button"
            className={Style.btnverProductos}
            onClick={() => router.push("/FormProductos")}
          >
            Ver Productos
          </button>

          <button
            type="button"
            className={Style.btnAñadirExistencia}
            onClick={irAMantenimientoExistencia}
          >
            Añadir Existencia
          </button>
        </div>

      </form>
    </div>
  );
}