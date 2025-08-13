// src/app/products/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { fetchProductById, fetchRelated } from "@/lib/products";

type PageParams = { id: string };
export const revalidate = 60;
export const metadata = { title: "Detalle del producto" };

// Helpers
function usd(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);
}

function parsePriceDisplay(s?: string | null) {
  if (!s) return null;
  const cleaned = s.replace(/[^\d.,-]/g, "");
  if (cleaned.includes(",") && cleaned.includes(".")) {
    const normalized = cleaned.replace(/\./g, "").replace(",", ".");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
  }
  if (cleaned.includes(",") && !cleaned.includes(".")) {
    const n = Number(cleaned.replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export default async function ProductDetailPage(
  { params }: { params: Promise<PageParams> } // si ya lo tenías así, lo dejo igual
) {
  const { id } = await params;
  const numId = Number(id);

  const product = await fetchProductById(numId);

  if (!product) {
    return (
      <section className="px-6 md:px-8 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-2xl font-bold text-slate-900">Producto no encontrado</h1>
          <p className="mt-2 text-slate-600">El producto solicitado no existe.</p>
          <Link href="/products" className="inline-block mt-6 underline">
            Volver a productos
          </Link>
        </div>
      </section>
    );
  }

  // Normalizo campos que pueden venir en snake o camel:
  const priceCents = (product as any).price_cents ?? (product as any).priceCents ?? null;
  const imageUrl = (product as any).image_url ?? (product as any).imageUrl ?? null;
  const priceText: string | null = (product as any).price ?? null;

  // priceNumber seguro:
  let priceNumber =
    typeof priceCents === "number" && Number.isFinite(priceCents)
      ? priceCents / 100
      : parsePriceDisplay(priceText) ?? 0;

  if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
    priceNumber = 0; // último fallback
  }

  // priceDisplay seguro:
  const priceDisplay =
    priceText && priceText.trim().length > 0 ? priceText : usd(priceNumber);

  const related = await fetchRelated(numId, 4);
  const imgSrc: string = imageUrl ?? "/placeholder.png";

  return (
    <>
      <section className="px-6 md:px-8 pt-12 md:pt-16 pb-16 md:pb-20">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-md">
            <div className="relative aspect-[4/3]">
              <Image
                src={imgSrc}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 600px"
                priority
              />
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200 shadow-md p-6 sm:p-8 text-slate-900">
            {product.category && (
              <span className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-700 px-3 py-1 text-xs font-semibold">
                {product.category}
              </span>
            )}

            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">
              {product.name}
            </h1>

            {product.description && (
              <p className="mt-3 text-slate-600">{product.description}</p>
            )}

            <div className="mt-6 flex items-center justify-between">
              <span className="text-2xl font-extrabold text-yellow-600">
                {priceDisplay}
              </span>

              <AddToCartButton
                id={product.id}
                name={product.name}
                priceNumber={priceNumber}     // ✅ número en USD
                priceDisplay={priceDisplay}   // ✅ texto para mostrar
                imageUrl={imageUrl}
                category={product.category}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 text-center">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
              También te puede gustar
            </h2>
            <span className="text-sm text-slate-500">Selección aleatoria para ti</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {related.map((r) => {
              const rImg: string = (r as any).image_url ?? (r as any).imageUrl ?? "/placeholder.png";
              return (
                <Link key={r.id} href={`/products/${r.id}`} className="group w-full sm:w-64">
                  <article className="rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 overflow-hidden">
                    <div className="relative">
                      <Image
                        src={rImg}
                        alt={r.name}
                        width={600}
                        height={400}
                        className="h-44 w-full object-cover"
                      />
                      {r.category && (
                        <span className="absolute top-3 left-3 text-[11px] font-semibold px-3 py-1 rounded-full bg-yellow-500 text-white shadow">
                          {r.category}
                        </span>
                      )}
                    </div>

                    <div className="p-4 text-slate-900">
                      <h3 className="font-bold leading-tight">{r.name}</h3>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-yellow-600 font-extrabold">
                          {(r as any).price ?? usd(((r as any).price_cents ?? 0) / 100)}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500 text-white text-xs font-semibold px-3 py-1 group-hover:bg-yellow-400 transition">
                          Ver más →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
