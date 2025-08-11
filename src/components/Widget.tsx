"use client";

import React from "react";

interface WidgetProps {
  title: string;
  content: string;
}

const Widget: React.FC<WidgetProps> = ({ title, content }) => {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white
                 p-6 md:p-8 text-slate-900 shadow-lg transition
                 hover:shadow-xl hover:-translate-y-0.5"
      role="article"
      aria-label={title}
    >
      {/* Icono con acento dorado */}
      <div className="mb-4 md:mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 ring-1 ring-yellow-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          className="h-5 w-5 text-yellow-500"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </div>

      {/* Título */}
      <h3 className="text-lg md:text-xl font-bold tracking-tight">
        {title}
      </h3>

      {/* Texto */}
      <p className="mt-2 md:mt-3 text-sm md:text-base text-slate-600">
        {content}
      </p>

      {/* CTA */}
      <div className="mt-5 md:mt-6">
        <button
          className="inline-flex items-center gap-2 rounded-full bg-yellow-500 text-white
                     px-4 py-2 md:px-5 md:py-2.5 text-sm font-semibold
                     hover:bg-yellow-400 transition"
          type="button"
        >
          Leer más
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </button>
      </div>
    </div>
  );
};

const WidgetsContainer: React.FC = () => {
  const widgetsInfo = [
    { title: "Envío Gratis", content: "Disfrutá de envío gratis en pedidos mayores a $50." },
    { title: "Soporte 24/7", content: "Nuestro equipo está disponible para ayudarte en cualquier momento." },
    { title: "Devoluciones fáciles", content: "Si no estás satisfecho, te devolvemos tu dinero." },
  ];

  return (
    <section
      aria-labelledby="benefits-title"
      className="w-full px-6 md:px-8 py-10 md:py-14 bg-transparent"
    >
      <h2 id="benefits-title" className="sr-only">Beneficios</h2>

      <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {widgetsInfo.map(({ title, content }) => (
          <Widget key={title} title={title} content={content} />
        ))}
      </div>
    </section>
  );
};

export default WidgetsContainer;
