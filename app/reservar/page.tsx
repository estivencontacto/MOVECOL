import type { Metadata } from "next";
import { BookingIntro } from "@/components/booking/booking-intro";
import { BookingProvider } from "@/components/booking/booking-provider";

export const metadata: Metadata = {
  title: "Reservar",
  description: "Reserva transporte privado, tours, traslados y servicios corporativos con MOVE Colombia."
};

export default function BookingPage() {
  return (
    <section className="bg-muted/45 py-6 md:py-8">
      <div className="container">
        <BookingIntro />
        <BookingProvider />
      </div>
    </section>
  );
}
