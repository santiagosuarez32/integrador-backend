// components/Hero.tsx
"use client";

import React from "react";

const Hero: React.FC = () => {
  return (
    <section
      className="
        relative isolate overflow-hidden
        flex items-center
        px-6 md:px-8
        pt-12 md:pt-0          /* 👈 más espacio arriba en mobile, normal en desktop */
        pb-16 md:pb-20
        w-full
        min-h-[calc(100vh-64px)]
        supports-[min-height:100svh]:min-h-[calc(100svh-64px)]
      "
    >
      <div className="mx-auto max-w-6xl w-full">
        <div className="mx-auto max-w-5xl flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-300/60 bg-white px-5 py-2 text-xs sm:text-sm font-semibold tracking-[0.18em] text-slate-600">
            NEW SPRING COLLECTION 2025
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl break-words">
            A Symphony of Scent
          </h1>

          <p className="mt-4 text-slate-600 max-w-2xl text-base sm:text-lg">
            Descubrí fragancias elaboradas con esencias seleccionadas y un acabado impecable.
            Elegancia atemporal para todos los días. Hechas para durar, pensadas para vos.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 w-full max-w-2xl">
            <a href="#shop" className="inline-flex min-w-[160px] items-center justify-center rounded-full bg-slate-900 text-white px-7 py-3 text-sm sm:text-base font-semibold hover:bg-slate-800 transition">
              Comprar ahora
            </a>
            <a href="#details" className="inline-flex min-w-[160px] items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3 text-sm sm:text-base font-semibold text-slate-900 hover:bg-slate-50 transition">
              Ver detalles
            </a>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
            {[
              { k: "140+", v: "Fragancias" },
              { k: "1M+", v: "Clientes" },
              { k: "4.9★", v: "Valoración" },
            ].map(({ k, v }) => (
              <div key={v} className="rounded-2xl bg-white border border-slate-200 py-4 px-4">
                <div className="text-lg sm:text-xl font-extrabold text-slate-500">{k}</div>
                <div className="text-xs sm:text-sm text-slate-500">{v}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl">
            {[
              { t: "Envíos gratis +$99", i: "🚚" },
              { t: "Devoluciones fáciles", i: "↩️" },
              { t: "Pago seguro", i: "🔒" },
            ].map(({ t, i }) => (
              <div key={t} className="rounded-xl bg-white/70 backdrop-blur border border-slate-200 text-slate-700 px-4 py-3 flex items-center justify-center gap-2">
                <span className="text-lg" aria-hidden="true">{i}</span>
                <span className="text-sm font-medium">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
