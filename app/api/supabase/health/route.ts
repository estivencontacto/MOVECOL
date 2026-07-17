import { withMoveSupabase } from "@/lib/supabase/route-handler";
import { enforceRateLimit } from "@/lib/services/rate-limit";

export const GET = withMoveSupabase({ auth: "none" }, async (request) => {
  const limited = enforceRateLimit(request, {
    key: "supabase-health",
    limit: 20,
    windowMs: 60_000
  });
  if (limited) return limited;

  return Response.json({ ok: true });
});
