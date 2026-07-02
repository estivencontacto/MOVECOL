import { withSupabase, type SupabaseContext, type WithSupabaseConfig } from "@supabase/server";
import { resolveSupabaseServerEnv } from "@/lib/supabase/env";

type SupabaseRouteHandler<Database> = (
  request: Request,
  context: SupabaseContext<Database>
) => Promise<Response>;

type UntypedDatabase = any;

export function withMoveSupabase<Database = UntypedDatabase>(
  config: WithSupabaseConfig,
  handler: SupabaseRouteHandler<Database>
) {
  return withSupabase<Database>(
    {
      cors: false,
      ...config,
      env: {
        ...resolveSupabaseServerEnv(),
        ...config.env
      }
    },
    handler
  );
}
