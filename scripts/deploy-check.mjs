const productionEnv = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";

const required = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "WOMPI_PUBLIC_KEY",
  "WOMPI_PRIVATE_KEY",
  "WOMPI_EVENTS_SECRET",
  "WOMPI_INTEGRITY_SECRET"
];

const missing = required.filter((key) => !process.env[key]);
const criticalProductionMissing = ["WOMPI_EVENTS_SECRET", "SUPABASE_SERVICE_ROLE_KEY"].filter(
  (key) => !process.env[key]
);

if (missing.length > 0) {
  console.error("Missing required production variables:");
  for (const key of missing) {
    console.error(`- ${key}`);
  }
  process.exit(1);
}

if (productionEnv && criticalProductionMissing.length > 0) {
  console.error("Missing critical security variables for production:");
  for (const key of criticalProductionMissing) {
    console.error(`- ${key}`);
  }
  process.exit(1);
}

console.log("Deployment environment looks ready.");
