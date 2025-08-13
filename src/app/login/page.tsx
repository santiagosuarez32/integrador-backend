"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Si aún aparece “email not confirmed”, es que no desactivaste Confirm email
      setErr(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/"); // o /account
  };

  return (
    <section className="px-6 md:px-8 pt-12 md:pt-16 pb-20">
      <div className="mx-auto max-w-md rounded-3xl bg-white border border-gray-200 shadow-md p-6 sm:p-8 text-slate-900">
        <h1 className="text-2xl font-extrabold text-center">Iniciar sesión</h1>
        <p className="mt-1 text-center text-slate-600 text-sm">Ingresá tus credenciales</p>

        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            className="w-full rounded-xl border px-4 py-2.5"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
          <input
            type="password"
            className="w-full rounded-xl border px-4 py-2.5"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-amber-400 text-neutral-900 px-6 py-2.5 font-semibold hover:bg-amber-300 transition disabled:opacity-60"
          >
            {loading ? "Ingresando…" : "Entrar"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          ¿No tenés cuenta?{" "}
          <a href="/register" className="underline">
            Crear cuenta
          </a>
        </p>
      </div>
    </section>
  );
}
