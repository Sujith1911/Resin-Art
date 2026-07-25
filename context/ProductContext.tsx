"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { MOCK_PRODUCTS } from "@/constants/mockData";
import { Product } from "@/types";

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    // Fallback if used outside provider (storefront pages without admin)
    return {
      products: MOCK_PRODUCTS,
      addProduct: () => {},
      updateProduct: () => {},
      deleteProduct: () => {},
    };
  }
  return ctx;
}
