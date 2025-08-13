// src/app/account/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useAuth } from "@/contexts/AuthContext";
import { UploadCloud, Trash2, Loader2 } from "lucide-react";

type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  avatar_path: string | null;
};

const BUCKET = "avatars";
const supabase = supabaseBrowser();

export default function AccountPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // -------- Profile state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pName, setPName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // -------- Password state
  const [currPwd, setCurrPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

  // -------- UI & errors
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const email = useMemo(() => user?.email ?? "", [user]);

  useEffect(() => {
    if (!user) return;

    (async () => {
      setErr("");
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, avatar_path")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        setErr(error.message);
        return;
      }

      const p = (data as Profile) ?? {
        id: user.id,
        display_name: user.user_metadata?.name ?? null,
        avatar_url: null,
        avatar_path: null,
      };

      setProfile(p);
      setPName(p.display_name ?? email.split("@")[0]);
    })();
  }, [user, email]);

  function onPickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setErr("El archivo debe ser una imagen.");
      return;
    }
    if (f.size > 3 * 1024 * 1024) {
      setErr("La imagen no puede superar 3MB.");
      return;
    }
    setErr("");
    setFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  }

  async function uploadAvatarIfNeeded(): Promise<{
    url: string | null;
    path: string | null;
    error?: string;
  }> {
    if (!file || !user) return { url: null, path: null };

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safe = (pName || "user").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    const path = `${user.id}/${crypto.randomUUID()}_${safe}.${ext}`;

    const { error: upErr } = await supabase
      .storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });

    if (upErr) return { url: null, path: null, error: upErr.message };

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { url: data.publicUrl, path };
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setErr("");
    setOk("");
    setSavingProfile(true);

    let avatar_url = profile?.avatar_url ?? null;
    let avatar_path = profile?.avatar_path ?? null;

    if (file) {
      const up = await uploadAvatarIfNeeded();
      if (up.error) {
        setErr(up.error);
        setSavingProfile(false);
        return;
      }
      avatar_url = up.url;
      // borro anterior si existía y se reemplaza
      if (profile?.avatar_path && profile.avatar_path !== up.path) {
        await supabase.storage.from(BUCKET).remove([profile.avatar_path]);
      }
      avatar_path = up.path;
    }

    const payload = {
      id: user.id,
      display_name: pName.trim() || null,
      avatar_url,
      avatar_path,
    };

    const { error } = await supabase.from("profiles").upsert(payload).eq("id", user.id);
    if (error) {
      setErr(error.message);
    } else {
      setOk("Perfil actualizado.");
      setProfile((prev) => (prev ? { ...prev, ...payload } : (payload as Profile)));
      setFile(null);
    }
    setSavingProfile(false);
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setErr("");
    setOk("");
    setSavingPwd(true);

    if (newPwd.length < 8) {
      setErr("La nueva contraseña debe tener al menos 8 caracteres.");
      setSavingPwd(false);
      return;
    }
    if (newPwd !== confirmPwd) {
      setErr("Las contraseñas no coinciden.");
      setSavingPwd(false);
      return;
    }

    // Verificamos contraseña actual
    const { error: verifyErr } = await supabase.auth.signInWithPassword({
      email,
      password: currPwd,
    });
    if (verifyErr) {
      setErr("La contraseña actual es incorrecta.");
      setSavingPwd(false);
      return;
    }

    // Actualizamos
    const { error: updErr } = await supabase.auth.updateUser({ password: newPwd });
    if (updErr) {
      setErr(updErr.message);
      setSavingPwd(false);
      return;
    }

    setOk("¡Contraseña actualizada!");
    setCurrPwd("");
    setNewPwd("");
    setConfirmPwd("");
    setSavingPwd(false);
  }

  async function deleteAccount() {
    if (!user) return;
    if (!confirm("¿Eliminar tu cuenta? Esta acción es irreversible.")) return;

    setErr("");
    setOk("");

    // Ruta que ya tengas creada con Service Role
    const res = await fetch("/api/account/delete", { method: "POST" });
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "No se pudo eliminar la cuenta." }));
      setErr(error || "No se pudo eliminar la cuenta.");
      return;
    }

    // Limpieza local y salida
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const avatarSrc =
    avatarPreview ||
    profile?.avatar_url ||
    "https://api.dicebear.com/8.x/initials/svg?seed=User&backgroundType=gradientLinear";

  if (loading) {
    return (
      <div className="mx-auto max-w-[1100px] px-4 md:px-6">
        <div className="rounded-3xl bg-white/90 border border-gray-200 shadow-md px-6 py-10 text-slate-900 grid place-items-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-[1100px] px-4 md:px-6">
        <div className="rounded-3xl bg-white/90 border border-gray-200 shadow-md p-6 text-slate-900">
          <p>Necesitás iniciar sesión para ver tu cuenta.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 md:px-6">
      <div className="rounded-3xl bg-white/95 border border-gray-200 shadow-md p-6 md:p-8 text-slate-900">
        <h1 className="text-2xl font-extrabold tracking-tight">Mi cuenta</h1>
        <p className="text-sm text-slate-600">{email}</p>

        {(err || ok) && (
          <div className="mt-4">
            {err && <p className="text-sm text-red-600">{err}</p>}
            {ok && <p className="text-sm text-green-600">{ok}</p>}
          </div>
        )}

        {/* Perfil */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 rounded-2xl border border-gray-200 p-5">
            <h2 className="font-bold mb-3">Perfil</h2>
            <form onSubmit={saveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Nombre visible</label>
                <input
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-4 py-2.5"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Avatar</label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="relative w-20 h-20 overflow-hidden rounded-full border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarSrc}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <label className="inline-flex items-center gap-2 rounded-full border px-4 py-2 cursor-pointer hover:bg-white/60">
                    <UploadCloud className="w-4 h-4" />
                    <span>Elegir imagen</span>
                    <input type="file" accept="image/*" className="hidden" onChange={onPickAvatar} />
                  </label>
                </div>
              </div>

              <div className="md:col-span-2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="rounded-full bg-amber-400 text-neutral-900 font-semibold px-5 py-2.5 hover:bg-amber-300 transition disabled:opacity-60"
                >
                  {savingProfile ? "Guardando…" : "Guardar cambios"}
                </button>
              </div>
            </form>
          </section>

          {/* Cambiar contraseña */}
          <section className="rounded-2xl border border-gray-200 p-5">
            <h2 className="font-bold mb-3">Cambiar contraseña</h2>
            <form onSubmit={changePassword} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">Contraseña actual</label>
                <input
                  type="password"
                  value={currPwd}
                  onChange={(e) => setCurrPwd(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-4 py-2.5"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Nueva contraseña</label>
                <input
                  type="password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-4 py-2.5"
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Repetir nueva contraseña</label>
                <input
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-4 py-2.5"
                  placeholder="Repetir contraseña"
                  required
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                disabled={savingPwd}
                className="rounded-full bg-amber-400 text-neutral-900 font-semibold px-5 py-2.5 hover:bg-amber-300 transition disabled:opacity-60"
              >
                {savingPwd ? "Actualizando…" : "Actualizar contraseña"}
              </button>
            </form>
          </section>
        </div>

        {/* Danger zone */}
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <h3 className="font-bold text-red-700 mb-2">Zona peligrosa</h3>
          <p className="text-sm text-red-700/80">
            Eliminar tu cuenta borrará tu perfil y cerrará tu sesión.
          </p>
          <button
            onClick={deleteAccount}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-red-300 text-red-700 px-4 py-2 hover:bg-red-100 transition"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
