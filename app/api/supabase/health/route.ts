import { withMoveSupabase } from "@/lib/supabase/route-handler";

export const GET = withMoveSupabase({ auth: "none" }, async (_request, ctx) => {
  return Response.json({
    ok: true,
    authMode: ctx.authMode
  });
});
