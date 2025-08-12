// src/lib/products.ts
import { supabaseServer } from "./supabaseServer";

export type UiProduct = {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  imageUrl: string | null;
  price: string;       // formateado
  priceCents: number;  // crudo
};

const fmt = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "USD",
});

const toUi = (row: any): UiProduct => ({
  id: row.id,
  name: row.name,
  description: row.description,
  category: row.category,
  imageUrl: row.image_url,
  priceCents: row.price_cents ?? 0,
  price: fmt.format(((row.price_cents ?? 0) / 100) || 0),
});

export async function fetchProducts(): Promise<UiProduct[]> {
  const supabase = await supabaseServer(); // 👈 await
  const { data, error } = await supabase
    .from("products")
    .select("id,name,description,price_cents,category,image_url")
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(toUi);
}

export async function fetchProductById(id: number): Promise<UiProduct | null> {
  const supabase = await supabaseServer(); // 👈 await
  const { data, error } = await supabase
    .from("products")
    .select("id,name,description,price_cents,category,image_url")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? toUi(data) : null;
}

export async function fetchRelated(id: number, limit = 4): Promise<UiProduct[]> {
  const supabase = await supabaseServer(); // 👈 await
  const { data, error } = await supabase
    .from("products")
    .select("id,name,description,price_cents,category,image_url")
    .neq("id", id)
    .order("id", { ascending: true })
    .limit(limit);

  if (error) return [];
  return (data ?? []).map(toUi);
}
