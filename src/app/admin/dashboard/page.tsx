// src/app/admin/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import {
  Plus,
  LogOut,
  Pencil,
  Trash2,
  Search,
  SlidersHorizontal,
  X,
  UploadCloud,
  Eye,
  RefreshCw,
} from "lucide-react";

const supabase = supabaseBrowser();
const BUCKET = "product-images";

/* ==============================
   Tipos
============================== */
type Product = {
  id: number;
  name: string;
  price_cents: number;
  category: string | null;
  image_url: string | null;
  image_path: string | null;
  description?: string | null;
};

type Order = {
  id: number;
  user_id: string | null;
  created_at: string;
  total_cents: number;
  payment_method: string | null;
  status: string;
  full_name: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_postal: string | null;
};

type OrderItem = {
  id: number;
  order_id: number;
  product_id: number | null;
  name: string;
  price_cents: number;
  qty: number;
  image_url: string | null;
  category: string | null;
};

type ProfileLite = { id: string; email: string | null };

/* ==============================
   Utils
============================== */
const fmt = (cents: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
  }).format((Number.isFinite(cents) ? cents : 0) / 100);

const ORDER_STATUSES = ["pending", "processing", "paid", "shipped", "cancelled"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  processing: "En proceso",
  paid: "Pagado",
  shipped: "Enviado",
  cancelled: "Cancelado",
};

const statusLabel = (s: OrderStatus) => STATUS_LABELS[s] ?? s;


/* ==============================
   Componente
============================== */
export default function AdminDashboard() {
  /* ---------- Tabs ---------- */
  const [tab, setTab] = useState<"products" | "orders">("products");

  /* ---------- Productos (tu UI actual) ---------- */
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // filtros productos
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [sort, setSort] = useState<"new" | "price-asc" | "price-desc">("new");

  // editor modal
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const isEditing = editingId !== null;

  // form del editor
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // fetch productos
  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      const { data, error } = await supabase
        .from("products")
        .select("id,name,price_cents,category,image_url,image_path")
        .order("id", { ascending: false })
        .limit(48);

      if (error) setErr(error.message);
      setItems((data ?? []) as Product[]);
      setLoading(false);
    })();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.category && set.add(i.category));
    return ["all", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    let arr = [...items];
    const s = q.trim().toLowerCase();
    if (s) {
      arr = arr.filter((p) =>
        [p.name, p.category].filter(Boolean).some((t) => String(t).toLowerCase().includes(s))
      );
    }
    if (cat !== "all") {
      arr = arr.filter((p) => p.category === cat);
    }
    if (sort === "price-asc") arr.sort((a, b) => a.price_cents - b.price_cents);
    if (sort === "price-desc") arr.sort((a, b) => b.price_cents - a.price_cents);
    return arr;
  }, [items, q, cat, sort]);

  function resetEditor() {
    setEditingId(null);
    setName("");
    setPrice("");
    setCategory("");
    setDescription("");
    setFile(null);
    setPreview(null);
    setCurrentImageUrl(null);
    setCurrentImagePath(null);
    setSaving(false);
  }

  function toCents(input: string) {
    const n = Number(String(input).replace(",", "."));
    return Number.isFinite(n) ? Math.round(n * 100) : 0;
  }

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    if (!f) return;
    const max = 3 * 1024 * 1024; // 3MB
    if (!f.type.startsWith("image/")) {
      setErr("El archivo debe ser una imagen.");
      return;
    }
    if (f.size > max) {
      setErr("La imagen no puede superar 3MB.");
      return;
    }
    setErr("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function uploadImageIfNeeded(): Promise<{
    publicUrl: string | null;
    path: string | null;
    error?: string;
  }> {
    if (!file) return { publicUrl: null, path: null };

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = (name || "product")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 40);
    const path = `products/${crypto.randomUUID()}_${safeName}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
    if (upErr) return { publicUrl: null, path: null, error: upErr.message };

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { publicUrl: data.publicUrl, path };
  }

  async function deleteImageByPath(path: string) {
    await supabase.storage.from(BUCKET).remove([path]);
  }

  async function openCreate() {
    resetEditor();
    setOpen(true);
  }

  async function openEdit(id: number) {
    resetEditor();
    setEditingId(id);
    setOpen(true);

    const { data, error } = await supabase
      .from("products")
      .select("id,name,price_cents,category,image_url,image_path,description")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      setErr(error?.message || "No se pudo cargar el producto.");
      setOpen(false);
      return;
    }

    const p = data as Product;
    setName(p.name);
    setPrice((p.price_cents / 100).toFixed(2));
    setCategory(p.category ?? "");
    setDescription(p.description ?? "");
    setCurrentImageUrl(p.image_url ?? null);
    setCurrentImagePath(p.image_path ?? null);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setSaving(true);

    const price_cents = toCents(price);
    if (!name.trim()) {
      setErr("El nombre es obligatorio.");
      setSaving(false);
      return;
    }
    if (price_cents <= 0) {
      setErr("El precio debe ser mayor a 0.");
      setSaving(false);
      return;
    }

    let publicUrl: string | null = currentImageUrl || null;
    let imagePath: string | null = currentImagePath || null;

    if (file) {
      const up = await uploadImageIfNeeded();
      if (up.error) {
        setErr(up.error);
        setSaving(false);
        return;
      }
      publicUrl = up.publicUrl;
      imagePath = up.path;
      if (isEditing && currentImagePath && currentImagePath !== imagePath) {
        await deleteImageByPath(currentImagePath);
      }
    }

    if (isEditing) {
      const { data, error } = await supabase
        .from("products")
        .update({
          name: name.trim(),
          price_cents,
          category: category.trim() || null,
          description: description.trim() || null,
          image_url: publicUrl,
          image_path: imagePath,
        })
        .eq("id", editingId!)
        .select()
        .single();

      if (error) {
        setErr(error.message);
        setSaving(false);
        return;
      }
      setItems((prev) => prev.map((p) => (p.id === data.id ? (data as Product) : p)));
      setOpen(false);
      setSaving(false);
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name: name.trim(),
          price_cents,
          category: category.trim() || null,
          description: description.trim() || null,
          image_url: publicUrl,
          image_path: imagePath,
        },
      ])
      .select()
      .single();

    if (error) {
      setErr(error.message);
      setSaving(false);
      return;
    }
    setItems((prev) => [data as Product, ...prev]);
    setOpen(false);
    setSaving(false);
  }

  async function onDelete(p: Product) {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;

    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) {
      setErr(error.message);
      return;
    }
    if (p.image_path) {
      await supabase.storage.from(BUCKET).remove([p.image_path]);
    }
    setItems((prev) => prev.filter((x) => x.id !== p.id));
  }

  /* ---------- Pedidos ---------- */
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersErr, setOrdersErr] = useState("");

  // filtros pedidos
  const [oq, setOq] = useState("");
  const [ostatus, setOstatus] = useState<"all" | OrderStatus>("all");

  // 👇 NUEVO: alcance (todos vs mis pedidos) + quién soy
  const [scope, setScope] = useState<"all" | "mine">("all");
  const [me, setMe] = useState<{ id: string } | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) setMe({ id: data.user.id });
    });
  }, []);

  // perfiles para mostrar email
  const [emailByUserId, setEmailByUserId] = useState<Record<string, string | null>>({});

  // detalle de pedido
  const [orderOpen, setOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [statusSaving, setStatusSaving] = useState(false);

  async function fetchOrders() {
    setOrdersLoading(true);
    setOrdersErr("");
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id,user_id,created_at,total_cents,payment_method,status,full_name,shipping_address,shipping_city,shipping_postal"
      )
      .order("id", { ascending: false })
      .limit(200);

    if (error) {
      setOrdersErr(error.message);
      setOrdersLoading(false);
      return;
    }

    const list = (data ?? []) as Order[];
    setOrders(list);

    // Mapear emails (si hay profiles sincronizados)
    const ids = Array.from(new Set(list.map((o) => o.user_id).filter(Boolean))) as string[];
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id,email")
        .in("id", ids);
      const map: Record<string, string | null> = {};
      (profs as ProfileLite[] | null)?.forEach((p) => (map[p.id] = p.email));
      setEmailByUserId(map);
    } else {
      setEmailByUserId({});
    }

    setOrdersLoading(false);
  }

  useEffect(() => {
    if (tab === "orders") fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const filteredOrders = useMemo(() => {
    const s = oq.trim().toLowerCase();
    let arr = [...orders];

    // 👇 NUEVO: alcance
    if (scope === "mine" && me?.id) {
      arr = arr.filter((o) => o.user_id === me.id);
    }

    // búsqueda
    if (s) {
      arr = arr.filter((o) => {
        const email = o.user_id ? emailByUserId[o.user_id] ?? "" : "";
        return (
          String(o.id).includes(s) ||
          (o.full_name || "").toLowerCase().includes(s) ||
          (email || "").toLowerCase().includes(s) ||
          (o.shipping_city || "").toLowerCase().includes(s)
        );
      });
    }
    // estado
    if (ostatus !== "all") {
      arr = arr.filter((o) => o.status === ostatus);
    }
    return arr;
  }, [orders, oq, ostatus, scope, me, emailByUserId]);

  async function openOrderDetail(order: Order) {
    setSelectedOrder(order);
    setSelectedItems([]);
    setOrderOpen(true);

    const { data, error } = await supabase
      .from("order_items")
      .select("id,order_id,product_id,name,price_cents,qty,image_url,category")
      .eq("order_id", order.id)
      .order("id", { ascending: true });

    if (!error) setSelectedItems((data ?? []) as OrderItem[]);
  }

  async function changeOrderStatus(order: Order, newStatus: OrderStatus) {
    if (order.status === newStatus) return;
    setStatusSaving(true);
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", order.id);
    setStatusSaving(false);
    if (error) {
      alert(error.message);
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)));
    if (selectedOrder?.id === order.id) setSelectedOrder({ ...order, status: newStatus });
  }

  /* ---------- UI ---------- */
  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
      <div className="rounded-3xl bg-white border border-gray-200 shadow-md pt-10 pb-8 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 text-slate-900">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
              Panel de Administrador
            </h1>
            <p className="text-xs md:text-sm text-slate-600">Gestión rápida del catálogo y pedidos.</p>
          </div>
          <div className="flex items-center gap-2">
            {tab === "products" && (
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 text-neutral-900 px-4 py-2 text-sm font-semibold hover:bg-amber-300 transition"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            )}
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                location.href = "/admin";
              }}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-white/70"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 inline-flex rounded-full border bg-white overflow-hidden">
          <button
            onClick={() => setTab("products")}
            className={`px-4 py-2 text-sm font-semibold ${
              tab === "products" ? "bg-amber-400 text-neutral-900" : "text-slate-700"
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`px-4 py-2 text-sm font-semibold ${
              tab === "orders" ? "bg-amber-400 text-neutral-900" : "text-slate-700"
            }`}
          >
            Pedidos
          </button>
        </div>

        {/* ===================== TAB: PRODUCTOS ===================== */}
        {tab === "products" && (
          <>
            {/* Toolbar productos */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white px-4 sm:px-5 md:px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="relative">
                  <span className="sr-only">Buscar</span>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar por nombre o categoría…"
                    className="w-full rounded-full border px-9 py-2.5 text-sm"
                  />
                </label>

                <label className="flex items-center gap-3">
                  <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                  <select
                    value={cat}
                    onChange={(e) => setCat(e.target.value)}
                    className="w-full rounded-full border px-3 py-2.5 text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c === "all" ? "Todas las categorías" : c}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 min-w-[64px]">Ordenar</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as "new" | "price-asc" | "price-desc")}
                    className="w-full rounded-full border px-3 py-2.5 text-sm"
                  >
                    <option value="new">Más nuevos</option>
                    <option value="price-asc">Precio: menor a mayor</option>
                    <option value="price-desc">Precio: mayor a menor</option>
                  </select>
                </label>
              </div>
            </div>

            {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

            {loading ? (
              <div className="mt-5 grid gap-6 grid-cols-[repeat(auto-fill,minmax(180px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                    <div className="h-44 w-full bg-slate-200 animate-pulse" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 w-2/3 bg-slate-200 rounded animate-pulse" />
                      <div className="h-3 w-1/3 bg-slate-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <p className="mt-6 text-black text-sm">No hay productos.</p>
            ) : (
              <div className="mt-5 grid gap-6 grid-cols-[repeat(auto-fill,minmax(180px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
                {filtered.map((p) => (
                  <article
                    key={p.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openEdit(p.id)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openEdit(p.id)}
                    className="relative cursor-pointer rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-transform duration-300 hover:-translate-y-[2px] overflow-hidden focus:outline-none focus:ring-2 focus:ring-amber-300"
                    title="Editar producto"
                    aria-label={`Editar ${p.name}`}
                  >
                    <div className="relative w-full aspect-[4/3] bg-slate-100">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center text-slate-400 text-xs">
                          Sin imagen
                        </div>
                      )}
                      {p.category && (
                        <span className="absolute top-2 left-2 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-yellow-500 text-white shadow">
                          {p.category}
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-[15px] md:text-base font-semibold leading-tight line-clamp-2">
                        {p.name}
                      </h3>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm md:text-[15px] font-extrabold text-amber-600">
                          ${(p.price_cents / 100).toFixed(2)}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(p.id);
                            }}
                            className="rounded-full border px-3 py-1 text-[12px] hover:bg-white/70"
                            aria-label="Editar"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4 inline -mt-0.5" /> Editar
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(p);
                            }}
                            className="rounded-full border px-3 py-1 text-[12px] text-red-600 hover:bg-red-50 border-red-200"
                            aria-label="Eliminar"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4 inline -mt-0.5" /> Borrar
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===================== TAB: PEDIDOS ===================== */}
        {tab === "orders" && (
          <>
            {/* Toolbar pedidos */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white px-4 sm:px-5 md:px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">{/* 👈 4 cols para el alcance */}
                <label className="relative">
                  <span className="sr-only">Buscar</span>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={oq}
                    onChange={(e) => setOq(e.target.value)}
                    placeholder="Buscar por #id, nombre, email o ciudad…"
                    className="w-full rounded-full border px-9 py-2.5 text-sm"
                  />
                </label>

                <label className="flex items-center gap-3">
                  <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                 <select
  value={ostatus}
  onChange={(e) => setOstatus(e.target.value as "all" | OrderStatus)}
  className="w-full rounded-full border px-3 py-2.5 text-sm"
>
  <option value="all">Todos los estados</option>
  {ORDER_STATUSES.map((s) => (
    <option key={s} value={s}>
      {statusLabel(s)}
    </option>
  ))}
</select>

                </label>

                {/* 👇 NUEVO: Alcance */}
                <label className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 min-w-[64px]">Alcance</span>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value as "all" | "mine")}
                    className="w-full rounded-full border px-3 py-2.5 text-sm"
                  >
                    <option value="all">Pedidos de usuarios</option>
                    <option value="mine">Mis pedidos</option>
                  </select>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchOrders}
                    className="rounded-full border px-4 py-2 text-sm hover:bg-white/70 inline-flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Actualizar
                  </button>
                </div>
              </div>
            </div>

            {ordersErr && <p className="mt-3 text-sm text-red-600">{ordersErr}</p>}

            {/* Tabla pedidos */}
            <div className="mt-5 overflow-x-auto rounded-2xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-slate-600">
                    <th className="px-4 py-3">#ID</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Pago</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ordersLoading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                        Cargando pedidos…
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                        No hay pedidos que coincidan.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => {
                      const email = o.user_id ? emailByUserId[o.user_id] ?? "" : "";
                      return (
                        <tr key={o.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-semibold">#{o.id}</td>
                          <td className="px-4 py-3">{new Date(o.created_at).toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-medium">{o.full_name || "—"}</span>
                              <span className="text-xs text-slate-500">
                                {email || o.user_id || ""}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-extrabold text-amber-600">
                            {fmt(o.total_cents)}
                          </td>
                          <td className="px-4 py-3">{o.payment_method || "—"}</td>
                          <td className="px-4 py-3">
                            <select
  value={o.status}
  onChange={(e) => changeOrderStatus(o, e.target.value as OrderStatus)}
  className="rounded-full border px-3 py-1.5 text-sm"
  disabled={statusSaving}
>
  {ORDER_STATUSES.map((s) => (
    <option key={s} value={s}>
      {statusLabel(s)}
    </option>
  ))}
</select>

                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => openOrderDetail(o)}
                              className="rounded-full border px-3 py-1.5 text-sm hover:bg-white/70 inline-flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" /> Ver
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ---------------- MODAL EDITOR (Productos) ---------------- */}
      {open && (
        <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm grid place-items-center p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden text-slate-900">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-extrabold">
                {isEditing ? `Editar producto #${editingId}` : "Nuevo producto"}
              </h3>
              <button
                className="rounded-full p-2 hover:bg-slate-100"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onSave} className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {err && <div className="md:col-span-2 text-sm text-red-600">{err}</div>}

              <div>
                <label className="block text-sm font-medium text-slate-900">Nombre</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5"
                  placeholder="Aroma Floral"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900">Precio (USD)</label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5"
                  placeholder="59.99"
                  inputMode="decimal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900">Categoría</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5"
                  placeholder="Floral / Amaderada / ..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900">Imagen</label>
                <label className="mt-1 block rounded-xl border border-dashed border-slate-400 px-4 py-6 text-center cursor-pointer hover:border-amber-400 transition">
                  <input type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
                  <div className="flex flex-col items-center gap-1 text-slate-800">
                    <UploadCloud className="w-5 h-5" />
                    <span className="text-xs">
                      Arrastrá una imagen o <span className="underline">explorá archivos</span>
                    </span>
                    <span className="text-[10px] text-slate-600">PNG/JPG · máx. 3MB</span>
                  </div>
                </label>

                {(preview || currentImageUrl) && (
                  <div className="mt-3">
                    <div className="text-xs text-slate-600 mb-1">Preview</div>
                    <img
                      src={preview || currentImageUrl || ""}
                      alt="preview"
                      className="h-28 w-40 object-cover rounded-xl border"
                    />
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-900">Descripción</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5"
                  rows={3}
                  placeholder="Fragancia fresca con notas florales y cítricas..."
                />
              </div>

              <div className="md:col-span-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-slate-300 px-5 py-2.5 font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-amber-400 text-neutral-900 font-semibold px-5 py-2.5 hover:bg-amber-300 disabled:opacity-60"
                >
                  {saving ? "Guardando…" : isEditing ? "Guardar cambios" : "Crear producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL DETALLE PEDIDO ---------------- */}
      {orderOpen && selectedOrder && (
        <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm grid place-items-center p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden text-slate-900">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-extrabold">Pedido #{selectedOrder.id}</h3>
              <button
                className="rounded-full p-2 hover:bg-slate-100"
                onClick={() => setOrderOpen(false)}
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Cliente</h4>
                <div className="text-sm">
                  <div>{selectedOrder.full_name || "—"}</div>
                  <div className="text-slate-600 text-xs">
                    {selectedOrder.user_id
                      ? emailByUserId[selectedOrder.user_id] || selectedOrder.user_id
                      : ""}
                  </div>
                </div>

                

                <h4 className="text-sm font-semibold mt-4 mb-2">Pago</h4>
                <div className="text-sm">
                  <div>Método: {selectedOrder.payment_method || "—"}</div>
                  <div>
                    Total: <span className="font-semibold">{fmt(selectedOrder.total_cents)}</span>
                  </div>
                </div>

                <h4 className="text-sm font-semibold mt-4 mb-2">Estado</h4>
                <select
  value={selectedOrder.status}
  onChange={(e) => changeOrderStatus(selectedOrder, e.target.value as OrderStatus)}
  className="rounded-full border px-3 py-1.5 text-sm"
  disabled={statusSaving}
>
  {ORDER_STATUSES.map((s) => (
    <option key={s} value={s}>
      {statusLabel(s)}
    </option>
  ))}
</select>

              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Ítems</h4>
                <div className="space-y-3 max-h-72 overflow-auto pr-1">
                  {selectedItems.length === 0 ? (
                    <div className="text-sm text-slate-500">Cargando ítems…</div>
                  ) : (
                    selectedItems.map((it) => (
                      <div key={it.id} className="flex gap-3 border rounded-xl p-2">
                        <img
                          src={it.image_url || "/placeholder.png"}
                          alt={it.name}
                          className="w-14 h-14 rounded-lg object-cover border"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{it.name}</div>
                          <div className="text-xs text-slate-500">{it.category || ""}</div>
                          <div className="text-sm mt-0.5">
                            {it.qty} × {fmt(it.price_cents)} ={" "}
                            <span className="font-semibold">{fmt(it.price_cents * (it.qty || 1))}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="px-5 pb-5">
              <div className="flex items-center justify-end gap-2">
                <button onClick={() => setOrderOpen(false)} className="rounded-full border px-5 py-2.5 hover:bg-slate-50">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
