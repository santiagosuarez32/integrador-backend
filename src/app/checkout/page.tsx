// src/app/checkout/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

const supabase = supabaseBrowser();

/** Ajustá solo si en tu tabla se llaman distinto */
const ORDER_COLUMNS = {
  address: "address",       // 👈 tu tabla usa 'address'
  city: "city",             // 👈 tu tabla usa 'city'
  postal: "postal_code",    // 👈 tu tabla usa 'postal_code'
} as const;

type PaymentMethod = "tarjeta" | "efectivo" | "transferencia" | "mercadopago";

const fmt = (cents: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD" }).format(
    (Number.isFinite(cents) ? cents : 0) / 100
  );

/** Convierte un item a centavos, aceptando priceCents (centavos) o price (USD). */
function unitCents(it: any): number {
  if (typeof it?.priceCents === "number" && Number.isFinite(it.priceCents)) {
    return Math.round(it.priceCents);
  }
  const p = Number(it?.price);
  if (Number.isFinite(p)) {
    return p > 1000 ? Math.round(p) : Math.round(p * 100);
  }
  return 0;
}

type FieldErrors = Partial<{
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postal: string;
  payment: string;
}>;

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: loadingAuth } = useAuth();
  const { items, clear } = useCart();

  // Redirigir a login si no hay user
  useEffect(() => {
    if (!loadingAuth && !user) router.push("/login");
  }, [loadingAuth, user, router]);

  const subtotalCents = useMemo(
    () => items.reduce((acc, it) => acc + unitCents(it) * (Number(it.qty) || 0), 0),
    [items]
  );

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("mercadopago");

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrs, setFieldErrs] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [submitErr, setSubmitErr] = useState("");

  // Modal “gracias”
  const [done, setDone] = useState<{ open: boolean; orderId?: number }>({ open: false });

  // ── Validaciones simples (cliente) ──
  function validate(): FieldErrors {
    const errs: FieldErrors = {};
    const nameRe = /^[A-Za-zÀ-ÿ' -]{2,40}$/;
    const cityRe = /^[A-Za-zÀ-ÿ' .-]{2,50}$/;
    const postalRe = /^[A-Za-z0-9 -]{3,10}$/;

    if (!nameRe.test(firstName.trim())) errs.firstName = "Ingresá un nombre válido (2–40 letras).";
    if (!nameRe.test(lastName.trim())) errs.lastName = "Ingresá un apellido válido (2–40 letras).";
    if (address.trim().length < 6) errs.address = "Dirección demasiado corta.";
    if (!cityRe.test(city.trim())) errs.city = "Ingresá una ciudad válida.";
    if (!postalRe.test(postal.trim())) errs.postal = "Código postal inválido.";
    if (!payment) errs.payment = "Elegí un método de pago.";

    return errs;
  }

  const isValid = useMemo(
    () => Object.keys(validate()).length === 0,
    [firstName, lastName, address, city, postal, payment]
  );

  function onBlur(name: keyof FieldErrors) {
    setTouched((t) => ({ ...t, [name]: true }));
    setFieldErrs(validate());
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitErr("");

    const errs = validate();
    setFieldErrs(errs);
    setTouched({
      firstName: true,
      lastName: true,
      address: true,
      city: true,
      postal: true,
      payment: true,
    });
    if (Object.keys(errs).length > 0) return;

    if (!user) return;
    if (!items.length) {
      setSubmitErr("No hay productos en el carrito.");
      return;
    }

    setSaving(true);

    // 1) Crear orden
    const orderPayload: Record<string, any> = {
      user_id: user.id,
      total_cents: subtotalCents,
      payment_method: payment,
      status: "pending",
      full_name: `${firstName.trim()} ${lastName.trim()}`,
      [ORDER_COLUMNS.address]: address.trim(),
      [ORDER_COLUMNS.city]: city.trim(),
      [ORDER_COLUMNS.postal]: postal.trim(),
    };

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert([orderPayload])
      .select("id")
      .single();

    if (orderErr || !order?.id) {
      setSubmitErr(
        orderErr?.message ||
          "No se pudo crear la orden. Verificá que las columnas existan en la tabla 'orders'."
      );
      setSaving(false);
      return;
    }

    // 2) Crear items de la orden
   const itemsPayload = items.map((it) => {
  const row: any = {
    order_id: order.id as number,
    product_id: Number(it.id) || Number(it.productId) || null,
    name: it.name,
    price_cents: unitCents(it),
    qty: Number(it.qty) || 1,
    image_url: it.imageUrl || null,
    category: it.category || null,
  };
  // Si más adelante agregás la columna "variant" en la DB,
  // podés volver a incluirla:
  // row.variant = it.variant ?? null;
  return row;
});

    const { error: itemsErr } = await supabase.from("order_items").insert(itemsPayload);
    if (itemsErr) {
      setSubmitErr(itemsErr.message);
      setSaving(false);
      return;
    }

    // 3) Limpiar carrito + mostrar modal
    clear();
    setSaving(false);
    setDone({ open: true, orderId: order.id as number });
  }

  if (loadingAuth || (!user && typeof window !== "undefined")) {
    return (
      <section className="px-6 md:px-8 py-16">
        <div className="mx-auto max-w-4xl text-center text-slate-900">Cargando…</div>
      </section>
    );
  }

  return (
    <>
      <section className="px-6 md:px-8 pt-14 md:pt-18 pb-20">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Resumen */}
          <aside className="rounded-3xl bg-white border border-gray-200 shadow-md p-6 sm:p-8 text-slate-900">
            <h2 className="text-lg font-extrabold mb-4">Resumen del pedido</h2>
            {items.length === 0 ? (
              <p className="text-slate-600">No hay productos en el carrito.</p>
            ) : (
              <ul className="space-y-4">
                {items.map((it, idx) => {
                  const unit = unitCents(it);
                  const line = unit * (Number(it.qty) || 1);
                  return (
                    <li key={`${it.id}-${it.variant ?? "default"}-${idx}`} className="flex gap-3">
                      <img
                        src={it.imageUrl || "/placeholder.png"}
                        alt={it.name}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{it.name}</div>
                        {it.category && (
                          <div className="text-xs text-slate-500">{it.category}</div>
                        )}
                        <div className="text-sm mt-1">
                          {it.qty} × {fmt(unit)} = <span className="font-semibold">{fmt(line)}</span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="text-lg font-extrabold text-yellow-600">{fmt(subtotalCents)}</span>
              </div>
            </div>
          </aside>

          {/* Formulario */}
          <form
            onSubmit={onSubmit}
            className="rounded-3xl bg-white border border-gray-200 shadow-md p-6 sm:p-8 text-slate-900"
            noValidate
          >
            <h1 className="text-xl md:text-2xl font-extrabold">Checkout</h1>
            <p className="text-sm text-slate-600">Completá tus datos de envío y pago.</p>

            {submitErr && <p className="mt-3 text-sm text-red-600">{submitErr}</p>}

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="text-sm">
                <span className="block text-slate-700 mb-1">Nombre</span>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={() => onBlur("firstName")}
                  className={`w-full rounded-xl border px-4 py-2.5 ${
                    touched.firstName && fieldErrs.firstName ? "border-red-400" : ""
                  }`}
                  required
                />
                {touched.firstName && fieldErrs.firstName && (
                  <small className="text-red-600">{fieldErrs.firstName}</small>
                )}
              </label>

              <label className="text-sm">
                <span className="block text-slate-700 mb-1">Apellido</span>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => onBlur("lastName")}
                  className={`w-full rounded-xl border px-4 py-2.5 ${
                    touched.lastName && fieldErrs.lastName ? "border-red-400" : ""
                  }`}
                  required
                />
                {touched.lastName && fieldErrs.lastName && (
                  <small className="text-red-600">{fieldErrs.lastName}</small>
                )}
              </label>

              <label className="sm:col-span-2 text-sm">
                <span className="block text-slate-700 mb-1">Dirección</span>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={() => onBlur("address")}
                  className={`w-full rounded-xl border px-4 py-2.5 ${
                    touched.address && fieldErrs.address ? "border-red-400" : ""
                  }`}
                  required
                />
                {touched.address && fieldErrs.address && (
                  <small className="text-red-600">{fieldErrs.address}</small>
                )}
              </label>

              <label className="text-sm">
                <span className="block text-slate-700 mb-1">Ciudad</span>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onBlur={() => onBlur("city")}
                  className={`w-full rounded-xl border px-4 py-2.5 ${
                    touched.city && fieldErrs.city ? "border-red-400" : ""
                  }`}
                  required
                />
                {touched.city && fieldErrs.city && (
                  <small className="text-red-600">{fieldErrs.city}</small>
                )}
              </label>

              <label className="text-sm">
                <span className="block text-slate-700 mb-1">Código Postal</span>
                <input
                  value={postal}
                  onChange={(e) => setPostal(e.target.value)}
                  onBlur={() => onBlur("postal")}
                  className={`w-full rounded-xl border px-4 py-2.5 ${
                    touched.postal && fieldErrs.postal ? "border-red-400" : ""
                  }`}
                  required
                />
                {touched.postal && fieldErrs.postal && (
                  <small className="text-red-600">{fieldErrs.postal}</small>
                )}
              </label>

              <label className="sm:col-span-2 text-sm">
                <span className="block text-slate-700 mb-1">Método de pago</span>
                <select
                  value={payment}
                  onChange={(e) => setPayment(e.target.value as PaymentMethod)}
                  onBlur={() => onBlur("payment")}
                  className={`w-full rounded-xl border px-4 py-2.5 ${
                    touched.payment && fieldErrs.payment ? "border-red-400" : ""
                  }`}
                >
                  <option value="mercadopago">Mercado Pago</option>
                  <option value="tarjeta">Tarjeta de crédito/débito</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="efectivo">Efectivo</option>
                </select>
                {touched.payment && fieldErrs.payment && (
                  <small className="text-red-600">{fieldErrs.payment}</small>
                )}
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => router.push("/products")}
                className="rounded-full border px-5 py-2.5 hover:bg-white/70"
              >
                Seguir comprando
              </button>
              <button
                type="submit"
                disabled={saving || items.length === 0 || !isValid}
                className="rounded-full bg-amber-400 text-neutral-900 font-semibold px-5 py-2.5 hover:bg-amber-300 disabled:opacity-60"
              >
                {saving ? "Procesando…" : "Comprar"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* MODAL GRACIAS */}
      {done.open && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white border border-gray-200 shadow-2xl p-6 text-slate-900">
            <div className="text-center">
              <div className="mx-auto mb-3 grid place-items-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 text-2xl">
                ✓
              </div>
              <h3 className="text-xl font-extrabold">¡Gracias por tu compra!</h3>
              <p className="mt-1 text-slate-600">
                Tu pedido {done.orderId ? <strong>#{done.orderId}</strong> : null} fue recibido.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setDone({ open: false });
                  router.push("/account/orders");
                }}
                className="rounded-full bg-amber-400 text-neutral-900 font-semibold px-4 py-2 hover:bg-amber-300"
              >
                Mis pedidos
              </button>
              <button
                onClick={() => {
                  setDone({ open: false });
                  router.push("/products");
                }}
                className="rounded-full border px-4 py-2 hover:bg-white/70"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
