"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { UploadCloud } from "lucide-react";

const supabase = supabaseBrowser();
const BUCKET = "avatars";
const DEFAULT_AVATAR = "/avatar-default.png";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    if (!f) return;
    if (!f.type.startsWith("image/")) return setErr("El archivo debe ser una imagen.");
    if (f.size > 3 * 1024 * 1024) return setErr("La imagen no puede superar 3MB.");
    setErr("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function uploadAvatar(uid: string) {
    if (!file) return { url: DEFAULT_AVATAR, path: null as string | null };

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${uid}/${crypto.randomUUID()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: false, cacheControl: "3600", contentType: file.type });
    if (upErr) throw upErr;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { url: data.publicUrl, path };
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const { data: sign, error: signErr } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { name } }, // metadatos
      });
      if (signErr || !sign.user) throw new Error(signErr?.message || "No se pudo registrar.");

      const { url, path } = await uploadAvatar(sign.user.id);

      // Crear/actualizar perfil
      const { error: profErr } = await supabase.from("profiles").upsert({
        id: sign.user.id,
        display_name: name.trim() || null,
        avatar_url: url,
        avatar_path: path,
      });
      if (profErr) throw profErr;

      // Auto-login ya viene desde signUp si email confirm desactivado
      router.push("/");
      router.refresh?.();
    } catch (e: any) {
      setErr(e.message ?? "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6 md:px-8 pt-12 pb-20">
      <div className="mx-auto max-w-md rounded-3xl bg-white border border-gray-200 shadow-md p-6 sm:p-8 text-slate-900">
        <h1 className="text-2xl font-extrabold text-center">Crear cuenta</h1>
        <p className="mt-1 text-center text-slate-600 text-sm">
          Registrate para comprar más rápido.
        </p>

        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {/* Avatar */}
          <div>
            <div className="flex items-center gap-4">
              <img
                src={preview || DEFAULT_AVATAR}
                alt="avatar"
                className="h-16 w-16 rounded-full object-cover border"
              />
              <label className="inline-flex items-center gap-2 rounded-full border px-4 py-2 cursor-pointer hover:bg-white/70">
                <UploadCloud className="w-4 h-4" />
                <span>Subir foto (opcional)</span>
                <input type="file" className="hidden" accept="image/*" onChange={onSelectFile} />
              </label>
            </div>
          </div>

          <input
            className="w-full rounded-xl border px-4 py-2.5"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            className="w-full rounded-xl border px-4 py-2.5"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full rounded-xl border px-4 py-2.5"
            placeholder="Contraseña"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-amber-400 text-neutral-900 px-6 py-2.5 font-semibold hover:bg-amber-300 transition disabled:opacity-60"
          >
            {loading ? "Creando…" : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          ¿Ya tenés cuenta?{" "}
          <a href="/login" className="underline">
            Iniciar sesión
          </a>
        </p>
      </div>
    </section>
  );
}
