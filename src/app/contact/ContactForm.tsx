// src/app/contact/ContactForm.tsx
"use client";

import React, { useState } from "react";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  // honeypot
  company?: string;
};

export default function ContactForm() {
  const [data, setData] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
    company: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (d: FormState) => {
    const e: Partial<FormState> = {};
    if (!d.name.trim()) e.name = "Ingresá tu nombre.";
    if (!d.email.trim()) e.email = "Ingresá tu email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = "Email inválido.";
    if (!d.subject.trim()) e.subject = "Ingresá un asunto.";
    if (!d.message.trim()) e.message = "Contanos tu consulta.";
    else if (d.message.length < 10) e.message = "Mínimo 10 caracteres.";
    // honeypot
    if (d.company && d.company.trim().length > 0) e.name = "Spam detectado.";
    return e;
    };

  const handleChange = (field: keyof FormState) => (ev: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setData({ ...data, [field]: ev.target.value });
    setErrors({ ...errors, [field]: undefined });
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate(data);
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      // Acá podés pegarle a una API/Action. Simulamos envío:
      await new Promise(r => setTimeout(r, 900));
      setSent(true);
      setData({ name: "", email: "", subject: "", message: "", company: "" });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 text-2xl">✓</div>
        <h3 className="mt-4 text-xl font-bold text-slate-900">¡Mensaje enviado!</h3>
        <p className="mt-1 text-slate-600">Te responderemos a la brevedad.</p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 rounded-full border border-neutral-300 px-5 py-2 hover:bg-white/60 transition"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 text-slate-900">
      {/* honeypot */}
      <input
        type="text"
        name="company"
        value={data.company}
        onChange={handleChange("company")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Nombre</span>
          <input
            type="text"
            value={data.name}
            onChange={handleChange("name")}
            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-300"
            placeholder="Tu nombre"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            value={data.email}
            onChange={handleChange("email")}
            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-300"
            placeholder="tu@email.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Asunto</span>
        <input
          type="text"
          value={data.subject}
          onChange={handleChange("subject")}
          className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-300"
          placeholder="Consulta sobre…"
        />
        {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Mensaje</span>
        <textarea
          value={data.message}
          onChange={handleChange("message")}
          rows={6}
          className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-amber-300"
          placeholder="Escribí tu mensaje…"
        />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
      </label>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          Protegido por validaciones en cliente y honeypot anti-spam.
        </p>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-amber-400 text-neutral-900 font-semibold px-6 py-2.5 hover:bg-amber-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Enviando…" : "Enviar mensaje"}
        </button>
      </div>
    </form>
  );
}
