import { readFileSync } from "node:fs";

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
  ["WOMPI_EVENTS_SECRET"],
  ["WOMPI_INTEGRITY_SECRET"],
  ["GOOGLE_MAPS_API_KEY"],
  ["NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY"],
  ["OPERATIONS_EMAIL"]
];

if (!productionEnv) {
  console.log("Skipping deployment environment check outside production.");
  process.exit(0);
}

const company = JSON.parse(
  readFileSync(new URL("../lib/legal/company.json", import.meta.url), "utf8")
);
const requiredLegalFields = [
  "phone",
  "phoneHref",
  "generalEmail",
  "principalCity",
  "lastUpdated",
  "termsVersion"
];
const missingLegalFields = requiredLegalFields.filter(
  (field) => typeof company[field] !== "string" || company[field].trim().length === 0
);

if (missingLegalFields.length > 0) {
  console.error("Missing required legal configuration:");
  for (const field of missingLegalFields) {
    console.error(`- ${field}`);
  }
  process.exit(1);
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

const configurationErrors = validateProductionConfiguration();
if (configurationErrors.length > 0) {
  console.error("Invalid production configuration:");
  for (const error of configurationErrors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Deployment environment looks ready.");

function validateProductionConfiguration() {
  const errors = [];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  try {
    const parsedUrl = new URL(appUrl);
    if (parsedUrl.protocol !== "https:") {
      errors.push("NEXT_PUBLIC_APP_URL must use HTTPS.");
    }
  } catch {
    errors.push("NEXT_PUBLIC_APP_URL must be a valid absolute URL.");
  }

  const wompiEnv = process.env.WOMPI_ENV;
  if (wompiEnv !== "sandbox" && wompiEnv !== "production") {
    errors.push("WOMPI_ENV must be sandbox or production.");
  } else {
    const prefixByVariable =
      wompiEnv === "production"
        ? {
            WOMPI_PUBLIC_KEY: "pub_prod_",
            WOMPI_PRIVATE_KEY: "prv_prod_",
            WOMPI_EVENTS_SECRET: "prod_events_",
            WOMPI_INTEGRITY_SECRET: "prod_integrity_"
          }
        : {
            WOMPI_PUBLIC_KEY: "pub_test_",
            WOMPI_PRIVATE_KEY: "prv_test_",
            WOMPI_EVENTS_SECRET: "test_events_",
            WOMPI_INTEGRITY_SECRET: "test_integrity_"
          };

    for (const [variable, prefix] of Object.entries(prefixByVariable)) {
      const value = process.env[variable];
      if (value && !value.startsWith(prefix)) {
        errors.push(`${variable} does not match WOMPI_ENV=${wompiEnv}.`);
      }
    }
  }

  const placeholderPattern = /^(change[-_ ]?me|replace[-_ ]?me|your[-_ ]|example)/i;
  for (const group of requiredGroups) {
    for (const variable of group) {
      const value = process.env[variable];
      if (value && placeholderPattern.test(value)) {
        errors.push(`${variable} still contains a placeholder value.`);
      }
    }
  }

  return errors;
}
