import type { Metadata } from "next";
import { BookingProvider } from "@/components/booking/booking-provider";

export const metadata: Metadata = {
  title: "Reservar",
  description: "Reserva transporte privado, tours, traslados y servicios corporativos con MOVE Colombia."
};

export default function BookingPage() {
  return (
    <section className="section bg-muted/45">
      <div className="container">
        <div className="mb-10 max-w-3xl">
          <p className="eyebrow">Reserva</p>
          <h1 className="mt-3 text-4xl font-semibold">Crea tu reserva privada</h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            Completa ciudad, servicio, fecha, ruta, pasajeros y vehiculo. El sistema guardara la
            solicitud, preparara el pago y activara la confirmacion operativa.
          </p>
        </div>
        <BookingProvider />
      </div>
    </section>
  );
}
