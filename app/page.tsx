import { LandingPage } from "@/components/sections/landing";

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city } = await searchParams;
  return <LandingPage initialCity={city} />;
}
