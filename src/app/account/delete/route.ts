// src/app/account/delete/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
// (opcional, si borras en Auth) import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST() {
  try {
    // 👇 FIX: esperar a que se cree el cliente
    const server = await supabaseServer();

    const {
      data: { user },
      error: authErr,
    } = await server.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ error: "No auth" }, { status: 401 });
    }

    // --- Lo que hagas al borrar la cuenta ---
    // Si usas servicio admin para borrar al usuario de Auth:
    // const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    // if (delErr) return NextResponse.json({ error: delErr.message }, { status: 400 });

    // Si solo borras datos propios en tus tablas (profiles, carts, etc.), algo así:
    // await supabaseServerSide.from("profiles").delete().eq("id", user.id);
    // await supabaseServerSide.from("carts").delete().eq("user_id", user.id);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
