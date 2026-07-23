import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const route = read("app/api/pricing/route/route.ts");
const form = read("components/booking/booking-form.tsx");
const middleware = read("middleware.ts");
const migration = read("supabase/migrations/008_secure_operations.sql");
const driverApi = read("app/api/conductor/trips/route.ts");
const driverLogin = read("app/api/conductor/session/route.ts");
const driverSession = read("lib/auth/driver-session.ts");

assert.match(route, /total: pricing\.amount/);
assert.doesNotMatch(route, /\.\.\.pricing|subtotal:|gatewayFee:|breakdown:/);
assert.doesNotMatch(form, /services\/pricing|COP_PER_KM|SURCHARGE/);
assert.match(middleware, /profile\.role !== "admin"/);
assert.match(middleware, /DRIVER_SESSION_COOKIE/);
assert.match(migration, /Drivers read assigned reservations/);
assert.match(migration, /Invalid driver trip status transition/);
assert.match(migration, /audit_reservations/);
assert.match(migration, /Admins manage profiles/);
assert.match(driverApi, /getActiveDriverSession/);
assert.match(driverApi, /\.eq\("driver_id", session\.driverId\)/);
assert.match(driverApi, /isAllowedDriverTransition/);
assert.match(driverLogin, /verifyTurnstile/);
assert.match(driverLogin, /driver_login_attempts/);
assert.match(driverLogin, /GENERIC_ERROR/);
assert.match(driverSession, /expiresAt/);
assert.match(driverSession, /httpOnly|DRIVER_SESSION_COOKIE/);
assert.doesNotMatch(driverLogin, /role\s*:/);

console.log("Security contract checks passed.");
