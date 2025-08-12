"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { UploadCloud, ImagePlus, X } from "lucide-react";

type DbProduct = {
  id: number;
  name: string;
  description: string | null;
  price_cents: number;
  category: string | null;
  image_url: string | null;  // URL pública
  image_path: string | null; // ruta interna en Storage (para borrar)
  created_at?: string | null;
};

const supabase = supabaseBrowser();
const BUCKET = "product-images";

export default function AdminProductsPage() {
  // data
  const [items, setItems] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  // filtros
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((p) =>
      [p.name, p.category, p.description]
        .filter(Boolean)
        .some((t) => String(t).toLowerCase().includes(s))
    );
  }, [items, q]);

  // form
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>(""); // "59.99"
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // imagen local
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);   // para mostrar si ya había
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null); // para borrar/reemplazar

  // dropzone
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const openPicker = () => inputRef.current?.click();

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      const { data, error } = await supabase
        .from("products")
        .select("id,name,description,price_cents,category,image_url,image_path,created_at")
        .order("id", { ascending: true });

      if (error) setErr(error.message);
      setItems(data ?? []);
      setLoading(false);
    })();
  }, []);

  // --- helpers ---
  function resetForm() {
    setEditingId(null);
    setName("");
    setPrice("");
    setCategory("");
    setDescription("");
    clearImage();
  }

  function toCents(input: string) {
    const n = Number(input.replace(",", "."));
    return Number.isFinite(n) ? Math.round(n * 100) : 0;
  }

  function validateAndSet(file: File | null) {
    if (!file) return;
    const max = 3 * 1024 * 1024; // 3MB
    if (!file.type.startsWith("image/")) {
      setErr("El archivo debe ser una imagen.");
      return;
    }
    if (file.size > max) {
      setErr("La imagen no puede superar 3MB.");
      return;
    }
    setErr("");
    setFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    validateAndSet(e.target.files?.[0] || null);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    validateAndSet(e.dataTransfer.files?.[0] || null);
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(true);
  }

  function onDragLeave() {
    setDragActive(false);
  }

  function clearImage() {
    setFile(null);
    setPreview(null);
    setCurrentImageUrl(null);
    // NOTA: si estás editando y “quitás” la imagen, recién se borra del storage al guardar (update).
    // No tocamos currentImagePath acá para permitir decidir en el submit.
  }

  async function uploadImageIfNeeded(): Promise<{ publicUrl: string | null; path: string | null; error?: string }> {
    if (!file) return { publicUrl: null, path: null };

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = (name || "product").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    const path = `products/${crypto.randomUUID()}_${safeName}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });

    if (upErr) return { publicUrl: null, path: null, error: upErr.message };

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { publicUrl: data.publicUrl, path };
  }

  async function deleteImageByPath(path: string) {
    await supabase.storage.from(BUCKET).remove([path]);
  }

  // --- actions ---
  async function handleCreateOrUpdate(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    const price_cents = toCents(price);
    if (!name.trim()) return setErr("El nombre es obligatorio.");
    if (price_cents <= 0) return setErr("El precio debe ser mayor a 0.");

    // subimos imagen si corresponde
    let publicUrl: string | null = currentImageUrl || null;
    let imagePath: string | null = currentImagePath || null;

    if (file) {
      const up = await uploadImageIfNeeded();
      if (up.error) return setErr(up.error);
      publicUrl = up.publicUrl;
      imagePath = up.path;

      // si estoy editando y había imagen previa, la borro
      if (isEditing && currentImagePath && currentImagePath !== imagePath) {
        await deleteImageByPath(currentImagePath);
      }
    } else if (!preview && !currentImageUrl && isEditing && currentImagePath) {
      // Estás editando y quitaste la imagen → borro la previa
      await deleteImageByPath(currentImagePath);
      imagePath = null;
    }

    if (isEditing) {
      const { data, error } = await supabase
        .from("products")
        .update({
          name: name.trim(),
          description: description.trim() || null,
          price_cents,
          category: category.trim() || null,
          image_url: publicUrl,
          image_path: imagePath,
        })
        .eq("id", editingId!)
        .select()
        .single();

      if (error) return setErr(error.message);
      setItems((prev) => prev.map((p) => (p.id === data.id ? data : p)));
      resetForm();
      return;
    }

    // crear
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name: name.trim(),
          description: description.trim() || null,
          price_cents,
          category: category.trim() || null,
          image_url: publicUrl,
          image_path: imagePath,
        },
      ])
      .select()
      .single();

    if (error) return setErr(error.message);
    setItems((prev) => [data, ...prev]);
    resetForm();
  }

  function startEdit(p: DbProduct) {
    setEditingId(p.id);
    setName(p.name);
    setPrice((p.price_cents / 100).toFixed(2));
    setCategory(p.category ?? "");
    setDescription(p.description ?? "");
    setCurrentImageUrl(p.image_url ?? null);
    setCurrentImagePath(p.image_path ?? null);
    setFile(null);
    setPreview(null);
  }

  async function handleDelete(id: number) {
    setErr("");
    const prod = items.find((x) => x.id === id);
    if (!prod) return;
    if (!confirm("¿Eliminar este producto?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return setErr(error.message);

    // borro la imagen del storage si hay
    if (prod.image_path) {
      await deleteImageByPath(prod.image_path);
    }

    setItems((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) resetForm();
  }

  // --- UI ---
  return (
    <div className="text-slate-900">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold">Productos</h1>
          <p className="text-sm text-slate-600">Crear, editar y eliminar productos.</p>
        </div>
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="rounded-full border px-4 py-2.5 pl-4 w-[260px]"
            placeholder="Buscar por nombre, categoría..."
          />
        </div>
      </div>

      {/* Formulario */}
      <div className="mt-6 rounded-3xl bg-white border border-gray-200 shadow-md p-6">
        <h2 className="font-bold mb-4">{isEditing ? "Editar producto" : "Nuevo producto"}</h2>

        {err && <p className="mb-3 text-sm text-red-600">{err}</p>}

        <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Nombre</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2.5"
              placeholder="Aroma Floral"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Precio (USD)</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2.5"
              placeholder="59.99"
              inputMode="decimal"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Categoría</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2.5"
              placeholder="Floral / Amaderada / ..."
            />
          </div>

          {/* Imagen local: dropzone + botón */}
          <div className="md:row-span-2">
            <label className="block text-sm font-medium text-slate-700">Imagen (desde tu PC)</label>

            <div
              onClick={openPicker}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openPicker()}
              className={[
                "mt-1 flex h-40 w-full items-center justify-center rounded-2xl border-2 border-dashed bg-white px-4 text-center cursor-pointer select-none transition",
                dragActive ? "border-amber-400 bg-amber-50" : "border-slate-300 hover:border-slate-400",
              ].join(" ")}
              aria-label="Subir imagen"
            >
              {preview || currentImageUrl ? (
                <img
                  src={preview || currentImageUrl || ""}
                  alt="preview"
                  className="h-full w-full object-cover rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <UploadCloud className="w-7 h-7 text-slate-500" />
                  <p className="text-sm text-slate-700">
                    Arrastrá una imagen o <span className="underline">explorá archivos</span>
                  </p>
                  <p className="text-xs text-slate-500">PNG, JPG • máx. 3MB</p>
                </div>
              )}
            </div>

            {/* input real oculto */}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              className="sr-only"
            />

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={openPicker}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-white/70 transition"
              >
                <ImagePlus className="w-4 h-4" />
                Elegir archivo
              </button>

              {(preview || currentImageUrl) && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-white/70 transition text-red-600"
                  title="Quitar imagen seleccionada"
                >
                  <X className="w-4 h-4" />
                  Quitar
                </button>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2.5"
              rows={5}
              placeholder="Fragancia fresca con notas florales y cítricas..."
            />
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              className="rounded-full bg-amber-400 text-neutral-900 font-semibold px-5 py-2.5 hover:bg-amber-300 transition"
            >
              {isEditing ? "Guardar cambios" : "Crear producto"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border px-5 py-2.5 hover:bg-white/70 transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Listado */}
      <div className="mt-6 rounded-3xl bg-white border border-gray-200 shadow-md p-4">
        <h2 className="font-bold mb-3">Listado</h2>

        {loading ? (
          <p className="text-slate-600">Cargando…</p>
        ) : filtered.length === 0 ? (
          <p className="text-slate-600">No hay productos.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Nombre</th>
                  <th className="py-2 pr-4">Precio</th>
                  <th className="py-2 pr-4">Categoría</th>
                  <th className="py-2 pr-4">Imagen</th>
                  <th className="py-2 pr-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="py-2 pr-4">{p.id}</td>
                    <td className="py-2 pr-4">{p.name}</td>
                    <td className="py-2 pr-4">${(p.price_cents / 100).toFixed(2)}</td>
                    <td className="py-2 pr-4">{p.category ?? "-"}</td>
                    <td className="py-2 pr-4">
                      {p.image_url ? (
                        <a className="underline" href={p.image_url} target="_blank" rel="noreferrer">
                          ver
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-2 pr-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(p)}
                          className="rounded-full border px-3 py-1 hover:bg-white/70"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="rounded-full border px-3 py-1 hover:bg-white/70 text-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
