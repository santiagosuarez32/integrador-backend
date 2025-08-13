// src/components/CartDrawer.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

type Props = { open: boolean; onClose: () => void };

const fmt = (cents: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD" }).format(
    (Number.isFinite(cents) ? cents : 0) / 100
  );

const clamp = (n: number, min = 1, max = 10) =>
  Math.max(min, Math.min(max, Number.isFinite(n) ? n : min));

/** Normaliza el precio unitario del item en CENTAVOS. */
function unitCents(it: any): number {
  if (typeof it?.priceCents === "number" && Number.isFinite(it.priceCents)) {
    return Math.round(it.priceCents);
  }
  const p = Number(it?.price);
  if (Number.isFinite(p)) {
    // Si viene muy grande, asumimos que ya está en centavos
    return p > 1000 ? Math.round(p) : Math.round(p * 100);
  }
  return 0;
}

export default function CartDrawer({ open, onClose }: Props) {
  const router = useRouter();
  const { items, count, remove, setQty, clear } = useCart();

  // Filtros locales
  const [minQty, setMinQty] = useState(0);
  const [cat, setCat] = useState<string>("");

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category).filter(Boolean))) as string[],
    [items]
  );

  const filtered = useMemo(
    () => items.filter((i) => (minQty ? i.qty >= minQty : true) && (cat ? i.category === cat : true)),
    [items, minQty, cat]
  );

  // Subtotal (de lo que se ve filtrado)
  const subtotalCents = useMemo(
    () => filtered.reduce((acc, it) => acc + unitCents(it) * (Number(it.qty) || 0), 0),
    [filtered]
  );

  // Cerrar con ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed right-0 top-0 z-[61] h-dvh w-full max-w-md bg-neutral-950 text-slate-100 shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="h-14 px-4 md:px-6 flex items-center justify-between border-b border-neutral-800">
          <h2 className="text-lg font-bold">Carrito ({count})</h2>
          <button
            onClick={onClose}
            className="rounded-full hover:bg-white/5 w-9 h-9 grid place-items-center"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Filtros */}
        <div className="px-4 md:px-6 py-3 border-b border-neutral-800 grid grid-cols-2 gap-3">
          <label className="text-sm">
            <span className="block text-slate-400 mb-1">Min. cantidad</span>
            <input
              type="number"
              min={0}
              max={10}
              value={minQty}
              onChange={(e) => setMinQty(clamp(Number(e.target.value || 0), 0, 10))}
              className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <span className="block text-slate-400 mb-1">Categoría</span>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2"
            >
              <option value="">Todas</option>
              {categories.map((c) => (
                <option key={c} value={c!}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Lista */}
        <div className="px-4 md:px-6 py-4 overflow-auto max-h-[calc(100dvh-14rem)]">
          {filtered.length === 0 ? (
            <p className="text-slate-400">Tu carrito está vacío o los filtros no devuelven resultados.</p>
          ) : (
            <ul className="space-y-4">
              {filtered.map((it, idx) => {
                const pid = Number(it.id) || Number(it.productId) || 0;
                const variantKey = it.variant ? String(it.variant) : "default";
                const qty = clamp(Number(it.qty) || 1);
                const unit = unitCents(it); // CENTAVOS
                const line = unit * qty;

                return (
                  <li
                    key={`${pid}-${variantKey}-${idx}`}
                    className="flex gap-3 border border-neutral-800 rounded-xl p-3 bg-neutral-900/40"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={it.imageUrl || "/placeholder.png"}
                      alt={it.name}
                      className="w-16 h-16 rounded-lg object-cover border border-neutral-800 bg-neutral-800/30"
                      loading="lazy"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{it.name}</div>
                          {it.category && (
                            <div className="text-xs text-slate-400 mt-0.5">{it.category}</div>
                          )}
                        </div>

                        <button
                          onClick={() => remove(pid, it.variant ?? null)}
                          className="text-slate-400 hover:text-white text-sm"
                        >
                          Eliminar
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        {/* Qty control */}
                        <div className="inline-flex items-center rounded-full border border-neutral-700">
                          <button
                            onClick={() => setQty(pid, clamp(qty - 1), it.variant ?? null)}
                            className="px-3 py-1.5 hover:bg-white/5"
                            aria-label="Disminuir"
                          >
                            −
                          </button>
                          <input
                            inputMode="numeric"
                            value={qty}
                            onChange={(e) => {
                              const n = clamp(Number(e.target.value || 0));
                              const res = setQty(pid, n, it.variant ?? null);
                              // si devolvés un objeto {ok:false}, volvemos al valor anterior
                              // @ts-ignore: por si tu setQty no retorna nada
                              if (res && res.ok === false) {
                                e.currentTarget.value = String(qty);
                              }
                            }}
                            className="w-10 text-center bg-transparent"
                          />
                          <button
                            onClick={() => setQty(pid, clamp(qty + 1), it.variant ?? null)}
                            className="px-3 py-1.5 hover:bg-white/5"
                            aria-label="Aumentar"
                          >
                            +
                          </button>
                        </div>

                        {/* Precios */}
                        <div className="text-right">
                          <div className="text-xs text-slate-400">
                            Unidad: {it.priceDisplay || fmt(unit)}
                          </div>
                          <div className="font-semibold">{fmt(line)}</div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 md:px-6 py-4 border-t border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400">Subtotal</span>
            <span className="text-lg font-bold text-amber-400">{fmt(subtotalCents)}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clear}
              className="flex-1 rounded-full border border-neutral-700 px-4 py-2 hover:bg-white/5"
            >
              Vaciar
            </button>
            <button
              disabled={count === 0}
              onClick={() => {
                onClose();
                router.push("/checkout");
              }}
              className="flex-1 rounded-full bg-amber-400 text-neutral-900 font-semibold px-4 py-2 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-amber-300"
            >
              Checkout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
