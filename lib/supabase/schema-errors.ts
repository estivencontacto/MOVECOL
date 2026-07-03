export function isMissingExpectedAmountColumnError(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const record = error as { code?: string; message?: string };
  const message = record.message ?? "";

  return (
    record.code === "42703" ||
    record.code === "PGRST204" ||
    message.includes("expected_amount_cents")
  );
}
