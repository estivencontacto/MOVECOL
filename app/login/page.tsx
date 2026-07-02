import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Login",
  robots: {
    index: false,
    follow: false
  }
};

export default function LoginPage() {
  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center bg-muted/45 px-4 py-16">
      {isSupabaseConfigured() ? (
        <LoginForm />
      ) : (
        <div className="max-w-md rounded-lg border bg-card p-6">
          <h1 className="text-xl font-semibold">Supabase no esta configurado</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para activar el login.
          </p>
        </div>
      )}
    </section>
  );
}
