import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await supabaseServer(); // supabaseServer es async
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin"); // no logueado → login
  }

  // (opcional) rol admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (profile && !profile.is_admin) {
    redirect("/"); // logueado pero sin rol admin
  }

  return (
    <section className="px-6 md:px-8 pt-12 md:pt-16 pb-20">
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}
