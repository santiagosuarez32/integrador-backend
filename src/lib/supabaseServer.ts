// src/lib/supabaseServer.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function supabaseServer() {
  // En Next 14/15 cookies() puede ser async; mejor await para evitar warnings.
  const cookieStore = await cookies();

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        // En RSC normalmente no seteamos cookies; si las necesitás en actions/route handlers, implementalas ahí.
        set() {},
        remove() {},
      },
    }
  );

  return client;
}
