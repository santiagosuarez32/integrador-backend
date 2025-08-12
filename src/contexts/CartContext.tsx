// src/contexts/CartContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: number;
  name: string;
  priceDisplay: string; // "$59.99"
  price: number;        // 59.99 (numérico para cálculos)
  imageUrl: string;
  category?: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;           // total de unidades
  subtotal: number;        // suma en número
  add: (item: Omit<CartItem, "qty" | "price"> & { price: number }, qty?: number) => { ok: boolean; error?: string };
  remove: (id: number) => void;
  setQty: (id: number, qty: number) => { ok: boolean; error?: string };
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // hidratar desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart:v1");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  // persistir
  useEffect(() => {
    try {
      localStorage.setItem("cart:v1", JSON.stringify(items));
    } catch {}
  }, [items]);

  const add: CartCtx["add"] = (item, qty = 1) => {
    if (qty < 1) return { ok: false, error: "La cantidad mínima es 1." };
    if (qty > 10) return { ok: false, error: "Máximo 10 unidades por producto." };

    setItems(prev => {
      const idx = prev.findIndex(it => it.id === item.id);
      if (idx === -1) {
        return [...prev, { ...item, priceDisplay: item.priceDisplay ?? `$${item.price.toFixed(2)}`, qty }];
      }
      const nextQty = Math.min(prev[idx].qty + qty, 10);
      const clone = [...prev];
      clone[idx] = { ...clone[idx], qty: nextQty };
      return clone;
    });
    return { ok: true };
  };

  const setQty: CartCtx["setQty"] = (id, qty) => {
    if (qty < 1) return { ok: false, error: "La cantidad mínima es 1." };
    if (qty > 10) return { ok: false, error: "Máximo 10 unidades por producto." };
    setItems(prev => prev.map(it => (it.id === id ? { ...it, qty } : it)));
    return { ok: true };
  };

  const remove = (id: number) => setItems(prev => prev.filter(it => it.id !== id));
  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((n, it) => n + it.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, it) => sum + it.price * it.qty, 0), [items]);

  const value = { items, count, subtotal, add, remove, setQty, clear };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
