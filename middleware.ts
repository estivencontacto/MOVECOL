import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getSupabasePublicCredentials } from "@/lib/supabase/env";
const DRIVER_SESSION_COOKIE = "move_driver_session";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const { url: supabaseUrl, publishableKey } = getSupabasePublicCredentials();

  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
  const isDriverPath = request.nextUrl.pathname.startsWith("/conductor");
  const isDriverLoginPath = request.nextUrl.pathname === "/conductor/login";
  const isConfigErrorPath = request.nextUrl.pathname === "/admin/config-error";

  if (isDriverPath) {
    const hasDriverSession = Boolean(request.cookies.get(DRIVER_SESSION_COOKIE)?.value);
    if (!isDriverLoginPath && !hasDriverSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/conductor/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return response;
  }

  if (!supabaseUrl || !publishableKey) {
    if (isAdminPath && !isConfigErrorPath) {
      console.error("Admin request blocked: Supabase public env vars are not configured.");
      const url = request.nextUrl.clone();
      url.pathname = "/admin/config-error";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return response;
  }

  const supabase = createServerClient(supabaseUrl, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (isAdminPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isAdminPath && user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/conductor/:path*"]
};
