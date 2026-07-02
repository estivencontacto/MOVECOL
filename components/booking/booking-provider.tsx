"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BookingForm } from "@/components/booking/booking-form";

export function BookingProvider() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BookingForm />
    </QueryClientProvider>
  );
}
