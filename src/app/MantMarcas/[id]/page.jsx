"use client";

import { use } from "react";
import MantMarcas from "@/components/MantMarcas";

export default function Page({ params }) {
  return <MantMarcas id={params.id} />;
}