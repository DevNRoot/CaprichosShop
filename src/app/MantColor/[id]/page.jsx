"use client";

import { use } from "react";
import MantColor from "@/components/MantColor";

export default function Page({ params }) {
  return <MantColor id={params.id}/>;
}