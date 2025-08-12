// src/app/contact/page.tsx
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contacto — CHICX",
  description: "Ponete en contacto con CHICX",
};

export default function ContactPage() {
  return (
    <section className="px-6 md:px-8 pt-12 md:pt-16 pb-20">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Contacto
          </h1>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            ¿Tenés alguna consulta sobre productos, envíos o colaboraciones?
            Escribinos y te respondemos a la brevedad.
          </p>
        </div>

        {/* Grid: Form + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2 rounded-3xl bg-white border border-gray-200 shadow-md p-6 sm:p-8">
            <ContactForm />
          </div>

          {/* Tarjetas de info */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-white border border-gray-200 shadow p-5 text-slate-900">
              <h3 className="font-bold text-slate-900">Atención al cliente</h3>
              <p className="mt-1 text-sm text-slate-600">Lun a Vie, 9–18hs (AR)</p>
              <a href="mailto:soporte@chicx.com" className="mt-3 inline-block text-amber-600 hover:underline">
                soporte@chicx.com
              </a>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 shadow p-5 text-slate-900">
              <h3 className="font-bold text-slate-900">WhatsApp</h3>
              <p className="mt-1 text-sm text-slate-600">Consultas rápidas</p>
              <a href="https://wa.me/5491112345678" target="_blank" className="mt-3 inline-block text-amber-600 hover:underline">
                +54 9 11 1234-5678
              </a>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 shadow p-5 text-slate-900">
              <h3 className="font-bold text-slate-900">Dirección</h3>
              <p className="mt-1 text-sm text-slate-600">
                Calle Falsa 123<br />CABA, Argentina
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
