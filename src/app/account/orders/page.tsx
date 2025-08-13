// src/app/account/orders/page.tsx
"use client";

import React from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useAuth } from "@/contexts/AuthContext";

const supabase = supabaseBrowser();

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

// Estados que guardás en la BD (inglés) → etiqueta para mostrar (español)
const ORDER_STATUSES = ["pending", "processing", "paid", "shipped", "cancelled"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  processing: "En proceso",
  paid: "Pagado",
  shipped: "Enviado",
  cancelled: "Cancelado",
};

function statusLabel(s: string) {
  return STATUS_LABELS[s as OrderStatus] ?? s; // fallback por si llega algo fuera de la lista
}

type OrderItem = {
  id: number;
  product_id: number | null;
  name: string;
  image_url: string | null;
  category: string | null;
  price_cents: number;
  qty: number;
};

type Order = {
  id: number;
  created_at: string;
  status: string;
  total_cents: number;
  order_items: OrderItem[];
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    (async () => {
      if (!user) return;
      setLoading(true);
      setErr("");

      const { data, error } = await supabase
        .from("orders")
        .select("id,created_at,status,total_cents,order_items(*)")
        // si tenés RLS que ya filtra por auth.uid(), podés quitar la siguiente línea:
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) setErr(error.message);
      setOrders((data ?? []) as any);
      setLoading(false);
    })();
  }, [user]);

  if (!user) {
    return (
      <section className="px-6 md:px-8 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-extrabold text-slate-900">Mis pedidos</h1>
          <p className="mt-2 text-slate-600">Iniciá sesión para ver tus pedidos.</p>
          <a href="/login" className="inline-block mt-4 underline">Ir a login</a>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 md:px-8 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-extrabold text-slate-900">Mis pedidos</h1>

        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

        {loading ? (
          <p className="mt-6 text-slate-600">Cargando…</p>
        ) : orders.length === 0 ? (
          <p className="mt-6 text-slate-600">Aún no tenés pedidos.</p>
        ) : (
          <div className="mt-6 space-y-6">
            {orders.map((o) => (
              <article
                key={o.id}
                className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4 sm:p-6 text-slate-900"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="font-bold">
                    Pedido #{o.id} ·{" "}
                    <span className="text-slate-500">
                      {new Date(o.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-amber-600 font-extrabold">
                    Total {money(o.total_cents)}
                  </div>
                </div>

                <div className="mt-3 text-sm">
                  Estado:{" "}
                  <span className="font-semibold">
                    {statusLabel(o.status)}
                  </span>
                </div>

                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {o.order_items?.map((it) => (
                    <li
                      key={it.id}
                      className="flex gap-3 items-center border border-gray-200 rounded-xl p-3"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={it.image_url || "/placeholder.png"}
                        alt={it.name}
                        className="w-14 h-14 rounded-lg object-cover border"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{it.name}</div>
                        {it.category && (
                          <div className="text-xs text-slate-500">{it.category}</div>
                        )}
                        <div className="text-xs text-slate-600">x{it.qty}</div>
                      </div>
                      <div className="text-sm font-bold">
                        {money(it.price_cents * it.qty)}
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
