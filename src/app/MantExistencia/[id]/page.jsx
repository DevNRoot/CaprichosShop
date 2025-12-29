"use client";
import MantExistencia from "@/components/MantExistencia";

export default function Page({ params }) {
  const { id } = params;

  return <MantExistencia id={id} />;
}