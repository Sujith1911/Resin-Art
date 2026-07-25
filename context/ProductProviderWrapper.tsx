"use client";

import { ProductProvider } from "@/context/ProductContext";

export function ProductProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ProductProvider>{children}</ProductProvider>;
}
