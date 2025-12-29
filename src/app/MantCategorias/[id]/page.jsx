"use client";

import { useParams } from "next/navigation";
import MantCategorias from "@/components/MantCategorias";

export default function Page() {
  const params = useParams();
  const id = params?.id;

  return <MantCategorias id={id} />;
}