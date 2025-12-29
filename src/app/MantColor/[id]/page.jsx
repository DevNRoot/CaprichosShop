"use client";

import { use } from "react";
import MantColor from "@/components/MantColor";

export default function Page({ params }) {
  const { id } = use(params);
  return <MantColor id={id} />;
}