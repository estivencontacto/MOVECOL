const productionEnv =
  process.argv.includes("--production") ||
  process.env.DEPLOY_CHECK_STRICT === "1" ||
  process.env.VERCEL_ENV === "production";

const requiredGroups = [
  ["NEXT_PUBLIC_APP_URL"],
  ["SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"],
  ["SUPABASE_PUBLISHABLE_KEY", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
  ["SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY"],
  ["WOMPI_PUBLIC_KEY"],
  ["WOMPI_PRIVATE_KEY"],
  ["WOMPI_EVENTS_SECRET"],
  ["WOMPI_INTEGRITY_SECRET"]
];

if (!productionEnv) {
  console.log("Skipping deployment environment check outside production.");
  process.exit(0);
}

const missing = requiredGroups
  .filter((keys) => !keys.some((key) => process.env[key]))
  .map((keys) => keys.join(" or "));
const criticalProductionMissing = [
  ["WOMPI_EVENTS_SECRET"],
  ["SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY"]
].filter((keys) => !keys.some((key) => process.env[key]))
  .map((keys) => keys.join(" or "));

if (missing.length > 0) {
  console.error("Missing required production variables:");
  for (const group of missing) {
    console.error(`- ${group}`);
  }
  process.exit(1);
}

if (productionEnv && criticalProductionMissing.length > 0) {
  console.error("Missing critical security variables for production:");
  for (const group of criticalProductionMissing) {
    console.error(`- ${group}`);
  }
  process.exit(1);
}

console.log("Deployment environment looks ready.");
