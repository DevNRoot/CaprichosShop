"use client";
import { GlobalDataProvider } from "../components/GlobalDataContext";

export function Providers({ children }) {
  return (
    <GlobalDataProvider>
        {children}
      </GlobalDataProvider>
  );
}