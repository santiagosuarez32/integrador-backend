"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { fetchProductById, fetchRelated } from "@/lib/products";


const supabase = supabaseBrowser();

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);

    const { data, error: signErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signErr || !data.user) {
      setLoading(false);
      setError(signErr?.message || "Credenciales inválidas");
      return;
    }

    // (opcional) validar rol
    const { data: profile, error: pErr } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", data.user.id)
      .maybeSingle();

    setLoading(false);

    if (pErr) {
      console.error("profileErr:", pErr);
      setError("Error verificando permisos.");
      return;
    }
    if (profile && !profile.is_admin) {
      await supabase.auth.signOut();
      setError("No tenés permisos de administrador.");
      return;
    }

    router.push("/admin/dashboard"); // ✅ URL correcta
  }

  return (
    <section className="px-6 md:px-8 pt-12 md:pt-16 pb-20">
      <div className="mx-auto max-w-md rounded-3xl bg-white border border-gray-200 shadow-md p-6 sm:p-8 text-slate-900">
        <h1 className="text-2xl font-extrabold text-center">Admin</h1>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input className="w-full rounded-xl border px-4 py-2.5" type="email" placeholder="Email admin"
                 value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <input className="w-full rounded-xl border px-4 py-2.5" type="password" placeholder="Contraseña"
                 value={password} onChange={(e)=>setPassword(e.target.value)} required />
          <button disabled={loading}
            className="w-full rounded-full bg-amber-400 text-neutral-900 px-6 py-2.5 font-semibold hover:bg-amber-300 transition disabled:opacity-60">
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </section>
  );
}
