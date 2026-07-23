import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export type AppRole = "admin" | "operator" | "driver" | "customer";

export async function requireRole(allowed: AppRole[]) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false as const, response: NextResponse.json({ error: "No autenticado" }, { status: 401 }) };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const role = profile?.role as AppRole | undefined;

  if (!role || !allowed.includes(role)) {
    return { ok: false as const, response: NextResponse.json({ error: "Acceso denegado" }, { status: 403 }) };
  }

  return { ok: true as const, user, role, supabase };
}
