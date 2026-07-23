import { DriverLoginForm } from "@/components/conductor/driver-login-form";

export default function DriverLoginPage() {
  return <section className="grid min-h-[calc(100vh-4rem)] place-items-center bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.12),transparent_45%)] px-4 py-12"><DriverLoginForm /></section>;
}
