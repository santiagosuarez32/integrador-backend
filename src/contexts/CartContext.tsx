// src/contexts/CartContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type CartItem = {
  // clave estable para el carrito (id de producto + opcional variante)
  id: string;                 // p.ej. "42" o "42:100ml"
  productId: number;          // id del producto
  name: string;
  qty: number;                // 1..10
  price: number;              // CENTAVOS (int)
  priceDisplay?: string;      // opcional, override de texto
  imageUrl?: string | null;
  category?: string | null;
  variant?: string | null;
};

type AddInput = {
  id?: number;                // compat: si te quedó "id"
  productId?: number;
  name: string;
  price: number;              // CENTAVOS
  priceDisplay?: string;
  imageUrl?: string | null;
  category?: string | null;
  variant?: string | null;
};

type Result = { ok: true } | { ok: false; error: string };

type CartContextType = {
  items: CartItem[];
  count: number;              // total de unidades
  subtotal: number;           // CENTAVOS
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (input: AddInput, qty?: number) => Result;
  setQty: (productId: number, qty: number, variant?: string | null) => Result;
  remove: (productId: number, variant?: string | null) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
};

const clampQty = (n: number, min = 1, max = 10) =>
  Math.max(min, Math.min(max, Number.isFinite(n) ? n : min));

const keyFor = (productId: number, variant?: string | null) =>
  `${productId}${variant ? `:${variant}` : ""}`;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth(); // si tenés AuthContext
  const storageKey = user?.id ? `cart:v1:${user.id}` : "cart:v1:guest";

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  // Cargar del storage al montar o cambiar usuario
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        setItems(
          parsed.map((x) => ({
            ...x,
            qty: clampQty(Number(x.qty) || 1),
            price: Number(x.price) || 0,
          }))
        );
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    }
  }, [storageKey]);

  // Guardar en storage al cambiar
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, storageKey]);

  const add = (input: AddInput, qty: number = 1): Result => {
    const productId = Number(input.productId ?? input.id);
    if (!Number.isFinite(productId)) return { ok: false, error: "productId inválido" };

    const price = Number(input.price);
    if (!Number.isFinite(price)) return { ok: false, error: "price inválido" };

    const variant = input.variant ?? null;
    const id = keyFor(productId, variant);
    const q = clampQty(qty);

    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === id);
      if (idx === -1) {
        return [
          ...prev,
          {
            id,
            productId,
            name: input.name,
            qty: q,
            price, // CENTAVOS
            priceDisplay: input.priceDisplay,
            imageUrl: input.imageUrl ?? null,
            category: input.category ?? null,
            variant,
          },
        ];
      } else {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: clampQty(next[idx].qty + q) };
        return next;
      }
    });

    return { ok: true };
  };

  const setQty = (productId: number, qty: number, variant?: string | null): Result => {
    if (!Number.isFinite(productId)) return { ok: false, error: "productId inválido" };
    const id = keyFor(productId, variant);
    const q = clampQty(qty);

    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = { ...next[idx], qty: q };
      return next;
    });

    return { ok: true };
  };

  const remove = (productId: number, variant?: string | null) => {
    const id = keyFor(productId, variant);
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((acc, it) => acc + (Number(it.qty) || 0), 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.qty) || 0), 0),
    [items]
  );

  const value: CartContextType = {
    items,
    count,
    subtotal, // CENTAVOS
    open,
    setOpen,
    add,
    setQty,
    remove,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
