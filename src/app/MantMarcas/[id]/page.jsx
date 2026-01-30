"use client";

import { use } from "react";
import MantMarcas from "@/components/MantMarcas";

export default function Page({ params }) {
  // const resolvedParams = use(params);
  // return <MantMarcas id={resolvedParams.id} />;
  return <MantMarcas id={params.id} />;
}