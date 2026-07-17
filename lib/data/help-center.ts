export type HelpLanguage = "ES" | "EN";

export type HelpFaq = {
  id: string;
  question: Record<HelpLanguage, string>;
  answer: Record<HelpLanguage, string>;
  href?: string;
};

export type HelpCategory = {
  id: "bookings" | "tours" | "payments" | "changes" | "vehicles" | "coverage";
  label: Record<HelpLanguage, string>;
  faqs: HelpFaq[];
};

const faq = (
  id: string,
  questionES: string,
  questionEN: string,
  answerES: string,
  answerEN: string,
  href?: string
): HelpFaq => ({
  id,
  question: { ES: questionES, EN: questionEN },
  answer: { ES: answerES, EN: answerEN },
  href
});

export const helpCategories: HelpCategory[] = [
  {
    id: "bookings",
    label: { ES: "Reservas", EN: "Bookings" },
    faqs: [
      faq("how-book", "¿Cómo hago una reserva?", "How do I book?", "Elige la ciudad y el servicio, organiza el recorrido, completa tus datos y revisa el resumen antes de continuar al pago.", "Choose the city and service, organize the trip, enter your details and review the summary before continuing to payment."),
      faq("instant-confirmation", "¿La reserva queda confirmada inmediatamente?", "Is the booking confirmed immediately?", "La solicitud y el pago pasan por validaciones operativas. Recibirás la confirmación por los canales informados en la reserva.", "The request and payment go through operational validation. You will receive confirmation through the contact channels entered in the booking."),
      faq("other-person", "¿Puedo reservar para otra persona?", "Can I book for someone else?", "Sí. Usa los datos de contacto de quien coordina la reserva e incluye el nombre del pasajero en observaciones.", "Yes. Use the contact details of the person coordinating the booking and include the passenger name in the notes."),
      faq("advance-time", "¿Con cuánto tiempo de anticipación debo reservar?", "How far in advance should I book?", "La disponibilidad depende del servicio, la ciudad, la fecha y el vehículo. Consulta con el equipo si necesitas una salida cercana.", "Availability depends on the service, city, date and vehicle. Contact the team if you need a near-term departure.")
    ]
  },
  {
    id: "tours",
    label: { ES: "Tours y traslados", EN: "Tours and transfers" },
    faqs: [
      faq("private-tours", "¿Los tours son privados?", "Are tours private?", "Los tours publicados por MOVE Colombia se presentan como experiencias privadas, salvo que el detalle del tour indique una condición diferente.", "Tours published by MOVE Colombia are presented as private experiences unless the tour detail states otherwise."),
      faq("pickup", "¿Dónde me recogen?", "Where is pickup?", "Puedes buscar el hotel, aeropuerto, clínica u otra ubicación mediante Google Maps durante la reserva.", "You can search for a hotel, airport, clinic or another location through Google Maps while booking."),
      faq("itinerary", "¿Puedo cambiar el itinerario?", "Can I change the itinerary?", "Los ajustes dependen del tiempo, tráfico, entradas, operación del día y condiciones del servicio. Escríbenos para revisar el cambio.", "Adjustments depend on timing, traffic, admissions, daily operations and service conditions. Contact us to review the change."),
      faq("delayed-flight", "¿Qué ocurre si mi vuelo se retrasa?", "What happens if my flight is delayed?", "Comparte el número de vuelo para facilitar el seguimiento. Los ajustes se coordinan según la información del vuelo y la disponibilidad operativa.", "Share the flight number to support monitoring. Adjustments are coordinated according to flight information and operational availability.")
    ]
  },
  {
    id: "payments",
    label: { ES: "Pagos", EN: "Payments" },
    faqs: [
      faq("payment-methods", "¿Qué métodos de pago aceptan?", "Which payment methods are accepted?", "El checkout se procesa mediante Wompi y muestra los medios disponibles para la transacción.", "Checkout is processed through Wompi and displays the payment methods available for the transaction."),
      faq("gateway-fee", "¿El precio incluye la comisión de pago?", "Does the price include the payment fee?", "El resumen separa la comisión de pasarela y la incluye en el total mostrado antes de continuar.", "The summary separates the gateway fee and includes it in the total shown before continuing."),
      faq("currency", "¿Los precios están en COP o USD?", "Are prices in COP or USD?", "Puedes cambiar la visualización entre COP y USD. La liquidación base del sistema se mantiene en COP.", "You can switch the display between COP and USD. The system's base calculation remains in COP."),
      faq("charge-time", "¿Cuándo se realiza el cobro?", "When is payment charged?", "El cobro se inicia cuando continúas desde la confirmación de la reserva hacia el checkout de Wompi.", "Payment starts when you continue from booking confirmation to Wompi checkout.")
    ]
  },
  {
    id: "changes",
    label: { ES: "Cambios y cancelaciones", EN: "Changes and cancellations" },
    faqs: [
      faq("change-date", "¿Puedo modificar la fecha?", "Can I change the date?", "Solicita el cambio por el canal de contacto. Su aprobación depende de disponibilidad y condiciones del servicio.", "Request the change through the contact channel. Approval depends on availability and service conditions.", "/legal/cancelaciones-y-reembolsos"),
      faq("request-cancellation", "¿Cómo solicito una cancelación?", "How do I request a cancellation?", "Envía el número de reserva y la solicitud al correo o WhatsApp de MOVE Colombia.", "Send the booking number and request to MOVE Colombia by email or WhatsApp.", "/legal/cancelaciones-y-reembolsos"),
      faq("refund", "¿Cuándo aplica un reembolso?", "When does a refund apply?", "La procedencia se revisa según el servicio, pagos realizados, costos no recuperables y la política vigente. No se publican porcentajes no confirmados.", "Eligibility is reviewed according to the service, payments made, non-recoverable costs and the current policy. Unconfirmed percentages are not published.", "/legal/cancelaciones-y-reembolsos")
    ]
  },
  {
    id: "vehicles",
    label: { ES: "Vehículos y equipaje", EN: "Vehicles and luggage" },
    faqs: [
      faq("choose-vehicle", "¿Qué vehículo debo elegir?", "Which vehicle should I choose?", "El formulario recomienda el vehículo más pequeño que cubre pasajeros y equipaje. Las opciones insuficientes quedan deshabilitadas.", "The form recommends the smallest vehicle that fits passengers and luggage. Insufficient options are disabled."),
      faq("luggage", "¿Cuánto equipaje puedo llevar?", "How much luggage can I bring?", "Cada tarjeta de vehículo muestra su capacidad estimada de equipaje. Elige la cantidad real para comprobar disponibilidad.", "Each vehicle card shows its estimated luggage capacity. Enter the actual quantity to check availability."),
      faq("groups", "¿Tienen vehículos para grupos?", "Do you have vehicles for groups?", "El catálogo incluye van y bus para grupos, sujetos a confirmación operativa.", "The catalog includes vans and buses for groups, subject to operational confirmation."),
      faq("van-bus", "¿La van y el bus requieren confirmación?", "Do vans and buses require confirmation?", "Sí. El resumen muestra la advertencia cuando la opción elegida requiere validar disponibilidad.", "Yes. The summary displays a warning when the selected option requires availability validation.")
    ]
  },
  {
    id: "coverage",
    label: { ES: "Cobertura y ciudades", EN: "Coverage and cities" },
    faqs: [
      faq("cities", "¿En qué ciudades opera MOVE?", "Which cities does MOVE serve?", "La operación pública principal se concentra en Bogotá y Medellín, con Medellín como ciudad principal informada.", "Public operations currently focus on Bogotá and Medellín, with Medellín as the stated principal city."),
      faq("outside-cities", "¿Ofrecen servicios fuera de Bogotá y Medellín?", "Do you serve areas outside Bogotá and Medellín?", "Algunos recorridos cubren zonas cercanas de Cundinamarca y Antioquia. Confirma el destino exacto antes de reservar.", "Some trips cover nearby areas of Cundinamarca and Antioquia. Confirm the exact destination before booking."),
      faq("eldorado", "¿Realizan traslados desde El Dorado?", "Do you offer transfers from El Dorado?", "Sí. Selecciona Bogotá y Traslado Aeropuerto para organizar origen, destino, fecha y vuelo.", "Yes. Select Bogotá and Airport Transfer to organize origin, destination, date and flight."),
      faq("mde-airport", "¿Realizan traslados desde José María Córdova?", "Do you offer transfers from José María Córdova?", "Sí. Selecciona Medellín y Traslado Aeropuerto para calcular el recorrido desde o hacia el aeropuerto.", "Yes. Select Medellín and Airport Transfer to calculate the route from or to the airport.")
    ]
  }
];
