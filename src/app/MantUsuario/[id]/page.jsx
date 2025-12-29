"use client";
import MantUsuario from "@/components/MantUsuario";

export default function Page({ params }) {
  const { id } = params;

  return <MantUsuario id={id} />;
}