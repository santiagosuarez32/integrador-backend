import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST() {
  try {
    const server = supabaseServer();
    const {
      data: { user },
    } = await server.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No auth" }, { status: 401 });
    }

    // tomar avatar_path para borrar archivo
    const { data: profile } = await server
      .from("profiles")
      .select("avatar_path")
      .eq("id", user.id)
      .maybeSingle();

    const admin = supabaseAdmin();

    // borrar avatar del storage (si existe)
    if (profile?.avatar_path) {
      await admin.storage.from("avatars").remove([profile.avatar_path]);
    }

    // borrar fila de profiles
    await admin.from("profiles").delete().eq("id", user.id);

    // borrar usuario auth
    await admin.auth.admin.deleteUser(user.id);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "delete-failed" }, { status: 500 });
  }
}
