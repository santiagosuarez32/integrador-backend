// server-only
import { createClient } from "@supabase/supabase-js";

export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY!; // ⚠️ nunca exponer al cliente
  return createClient(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
