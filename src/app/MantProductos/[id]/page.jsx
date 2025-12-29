"use client";
import MantProductos from "@/components/MantProductos";

export default function Page({ params }) {
  return <MantProductos id={params.id} />;
}