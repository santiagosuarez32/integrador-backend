// src/lib/products.ts
import { supabaseServer } from "./supabaseServer";

export type UiProduct = {
  id: number;
  name: string;
  description: string;
  price: string;          // "$59.99"
  price_cents: number;    // 5999
  category: string;
  imageUrl: string;       // url pública o placeholder
};

type DbProduct = {
  id: number;
  name: string;
  description: string | null;
  price_cents: number;
  category: string | null;
  image_url: string | null;
};

const PLACEHOLDER = "/placeholder.png";

function mapDbToUi(p: DbProduct): UiProduct {
  const cents = p.price_cents ?? 0;
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    price_cents: cents,
    price: `$${(cents / 100).toFixed(2)}`,
    category: p.category ?? "General",
    imageUrl: p.image_url ?? PLACEHOLDER,
  };
}

export async function fetchProducts(): Promise<UiProduct[]> {
  const supabase = await supabaseServer(); // 👈 importante
  const { data, error } = await supabase
    .from("products")
    .select("id,name,description,price_cents,category,image_url")
    .order("id", { ascending: true });

  if (error) {
    console.error("fetchProducts error:", error.message);
    return [];
  }
  return (data ?? []).map(mapDbToUi);
}

export async function fetchProductById(id: number): Promise<UiProduct | null> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("products")
    .select("id,name,description,price_cents,category,image_url")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return mapDbToUi(data as DbProduct);
}

/**
 * Devuelve productos relacionados por categoría (excluye el actual).
 * Si no hay suficientes, rellena con los últimos productos.
 */
export async function fetchRelated(id: number, limit = 4): Promise<UiProduct[]> {
  const supabase = await supabaseServer();

  // 1) obtener la categoría del producto base
  const { data: base, error: baseErr } = await supabase
    .from("products")
    .select("id,category")
    .eq("id", id)
    .maybeSingle();

  if (baseErr) {
    console.error("fetchRelated baseErr:", baseErr.message);
  }

  let related: DbProduct[] = [];

  // 2) intentar por misma categoría
  if (base?.category) {
    const { data, error } = await supabase
      .from("products")
      .select("id,name,description,price_cents,category,image_url")
      .eq("category", base.category)
      .neq("id", id)
      .order("id", { ascending: false })
      .limit(limit);

    if (!error && data) related = data as DbProduct[];
  }

  // 3) fallback: últimos productos (excluye el actual)
  if (!related || related.length < limit) {
    const missing = limit - (related?.length ?? 0);
    const excludeIds = new Set<number>([id, ...(related ?? []).map(r => r.id)]);
    const { data: more } = await supabase
      .from("products")
      .select("id,name,description,price_cents,category,image_url")
      .neq("id", id)
      .order("id", { ascending: false })
      .limit(limit * 2); // traigo algunos extra y filtro

    const extra = (more ?? [])
      .filter((p) => !excludeIds.has(p.id))
      .slice(0, missing) as DbProduct[];

    related = [...(related ?? []), ...extra];
  }

  return (related ?? []).map(mapDbToUi).slice(0, limit);
}
