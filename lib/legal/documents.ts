import { company } from "@/lib/legal/company";

export type LegalLanguage = "ES" | "EN";

export type LegalSection = {
  id: string;
  title: Record<LegalLanguage, string>;
  paragraphs: Record<LegalLanguage, string[]>;
};

export type LegalDocument = {
  slug: string;
  title: Record<LegalLanguage, string>;
  summary: Record<LegalLanguage, string>;
  sections: LegalSection[];
};

const section = (
  id: string,
  titleES: string,
  titleEN: string,
  paragraphsES: string[],
  paragraphsEN: string[]
): LegalSection => ({
  id,
  title: { ES: titleES, EN: titleEN },
  paragraphs: { ES: paragraphsES, EN: paragraphsEN }
});

export const legalDocuments: LegalDocument[] = [
  {
    slug: "terminos-y-condiciones",
    title: {
      ES: "Términos y condiciones",
      EN: "Terms and conditions"
    },
    summary: {
      ES: "Borrador informativo para regular el uso del sitio, las solicitudes de reserva y la prestación de servicios de MOVE Colombia. Debe recibir revisión jurídica profesional antes de considerarse una versión definitiva.",
      EN: "Informative translation of the draft governing the website, booking requests and MOVE Colombia services. The Spanish version prevails until a professional legal review is completed."
    },
    sections: [
      section(
        "identificacion",
        "Identificación y contacto",
        "Identification and contact",
        [
          `${company.tradeName} es el nombre comercial visible en este sitio. El canal general de contacto es ${company.generalEmail}, el teléfono es ${company.phone} y la ciudad principal de operación informada es ${company.principalCity}.`
        ],
        [
          `${company.tradeName} is the trade name displayed on this website. The general contact channel is ${company.generalEmail}, the phone number is ${company.phone}, and the stated principal city of operation is ${company.principalCity}.`
        ]
      ),
      section(
        "objeto",
        "Objeto y alcance",
        "Purpose and scope",
        [
          "Estos términos regulan la navegación, las cotizaciones, las solicitudes de reserva, los pagos y la coordinación de traslados, servicios por horas, tours privados, turismo médico y movilidad corporativa.",
          "La información comercial visible forma parte de la oferta solo cuando también aparece en la confirmación de reserva."
        ],
        [
          "These terms govern browsing, quotes, booking requests, payments and the coordination of transfers, hourly services, private tours, medical travel and corporate mobility.",
          "Commercial information shown on the website forms part of the offer only when it is also included in the booking confirmation."
        ]
      ),
      section(
        "definiciones",
        "Definiciones",
        "Definitions",
        [
          "Usuario es quien navega el sitio. Pasajero es quien recibe el servicio. Reserva es la solicitud aceptada y confirmada. Proveedor aliado es un tercero que participa en la operación. Precio global corresponde al valor total indicado para el servicio. Precio por persona se calcula según pasajeros y mínimo informado."
        ],
        [
          "User means a website visitor. Passenger means the service recipient. Booking means an accepted and confirmed request. Partner provider means a third party involved in the operation. Global price means the total displayed service price. Per-person price is calculated using the passenger count and stated minimum."
        ]
      ),
      section(
        "servicios",
        "Servicios ofrecidos",
        "Services offered",
        [
          "MOVE Colombia presenta traslados privados, transporte por horas, tours, turismo médico y soluciones corporativas. La cobertura, el vehículo, el itinerario, los horarios y los incluidos dependen de la ciudad y del servicio seleccionado."
        ],
        [
          "MOVE Colombia presents private transfers, hourly transport, tours, medical travel and corporate solutions. Coverage, vehicle, itinerary, schedule and inclusions depend on the selected city and service."
        ]
      ),
      section(
        "disponibilidad",
        "Disponibilidad y confirmación",
        "Availability and confirmation",
        [
          "Enviar un formulario o recibir una cotización no garantiza disponibilidad. La reserva queda confirmada cuando MOVE Colombia comunica la aceptación operativa y, cuando corresponda, verifica el pago.",
          "Vans, buses, actividades de terceros, guías y entradas pueden requerir validación adicional."
        ],
        [
          "Submitting a form or receiving a quote does not guarantee availability. A booking is confirmed when MOVE Colombia communicates operational acceptance and, when applicable, verifies payment.",
          "Vans, buses, third-party activities, guides and admissions may require additional validation."
        ]
      ),
      section(
        "precios",
        "Precios, moneda e impuestos",
        "Prices, currency and taxes",
        [
          "Los precios se muestran en COP y pueden visualizarse en USD como referencia. La conversión a USD puede variar según la tasa disponible. El valor exigible es el confirmado antes del pago.",
          "El resumen debe indicar si el precio es global o por persona, el mínimo aplicable, los conceptos incluidos y cualquier comisión de pago mostrada antes de confirmar."
        ],
        [
          "Prices are displayed in COP and may be viewed in USD as a reference. The USD conversion may change with the available exchange rate. The payable amount is the amount confirmed before payment.",
          "The summary must state whether the price is global or per person, the applicable minimum, included items and any payment fee displayed before confirmation."
        ]
      ),
      section(
        "incluidos",
        "Servicios incluidos y excluidos",
        "Included and excluded services",
        [
          "Cada ficha de tour o confirmación identifica los servicios incluidos y excluidos. Alimentación, entradas, consumos, propinas, equipaje especial, tiempos adicionales y actividades no mencionadas no se entienden incluidos."
        ],
        [
          "Each tour page or confirmation identifies included and excluded services. Meals, admissions, purchases, tips, special luggage, additional time and unlisted activities are not included."
        ]
      ),
      section(
        "pagos",
        "Wompi y confirmación de pago",
        "Wompi and payment confirmation",
        [
          "Los pagos electrónicos pueden ser procesados por Wompi. MOVE Colombia no almacena los datos completos de la tarjeta. La aprobación mostrada por la pasarela puede requerir validación posterior mediante el evento o confirmación de pago recibido.",
          "Un pago rechazado, pendiente o reversado no confirma la prestación del servicio."
        ],
        [
          "Electronic payments may be processed by Wompi. MOVE Colombia does not store complete card details. Approval shown by the gateway may require later validation through the received payment event or confirmation.",
          "A rejected, pending or reversed payment does not confirm service delivery."
        ]
      ),
      section(
        "cancelaciones",
        "Cancelaciones, reprogramaciones y reembolsos",
        "Cancellations, rescheduling and refunds",
        [
          "Las reglas específicas deben mostrarse antes del pago y quedar asociadas a la confirmación. Mientras no exista una tabla general aprobada, no se publican porcentajes, penalidades ni plazos fijos.",
          "Las solicitudes se revisan según el tipo de servicio, los costos ya causados, las condiciones de terceros y los derechos irrenunciables del consumidor. Consulta la política de cancelaciones para más detalle."
        ],
        [
          "Specific rules must be shown before payment and attached to the confirmation. Until a general schedule is approved, no fixed percentages, penalties or deadlines are published.",
          "Requests are reviewed according to service type, incurred costs, third-party conditions and mandatory consumer rights. See the cancellation policy for further detail."
        ]
      ),
      section(
        "no-show",
        "No-show y retrasos del pasajero",
        "No-show and passenger delays",
        [
          "La confirmación debe indicar el punto, la hora y el canal de contacto. Si el pasajero no se presenta o no puede ser contactado, MOVE Colombia documentará el intento de prestación y evaluará la continuidad, los tiempos de espera y los costos realmente causados."
        ],
        [
          "The confirmation must state the location, time and contact channel. If the passenger does not appear or cannot be reached, MOVE Colombia will document the service attempt and assess continuity, waiting time and actual incurred costs."
        ]
      ),
      section(
        "itinerario",
        "Cambios de itinerario",
        "Itinerary changes",
        [
          "Cambios de ruta, nuevas paradas, tiempo adicional o modificaciones de pasajeros y equipaje pueden alterar el precio, el vehículo o la disponibilidad. Todo cambio requiere aceptación operativa."
        ],
        [
          "Route changes, new stops, additional time or changes to passengers and luggage may alter price, vehicle or availability. Every change requires operational acceptance."
        ]
      ),
      section(
        "fuerza-mayor",
        "Tráfico, clima, cierres y fuerza mayor",
        "Traffic, weather, closures and force majeure",
        [
          "Los tiempos son estimados. Tráfico, clima, cierres viales, restricciones de autoridad, fallas de terceros, manifestaciones y otros eventos fuera del control razonable pueden exigir cambios de ruta, horario, actividad o vehículo.",
          "MOVE Colombia informará las alternativas disponibles sin desconocer los derechos del consumidor."
        ],
        [
          "Travel times are estimates. Traffic, weather, road closures, authority restrictions, third-party failures, demonstrations and other events outside reasonable control may require changes to route, schedule, activity or vehicle.",
          "MOVE Colombia will communicate available alternatives without limiting consumer rights."
        ]
      ),
      section(
        "pasajero",
        "Responsabilidades del pasajero",
        "Passenger responsibilities",
        [
          "El pasajero debe suministrar información veraz, llegar al punto acordado, respetar las normas del vehículo y del destino, informar condiciones de movilidad relevantes y abstenerse de realizar conductas ilegales o que pongan en riesgo la operación."
        ],
        [
          "Passengers must provide accurate information, arrive at the agreed location, follow vehicle and destination rules, disclose relevant mobility conditions and refrain from illegal or unsafe conduct."
        ]
      ),
      section(
        "equipaje",
        "Equipaje y objetos personales",
        "Luggage and personal belongings",
        [
          "La capacidad depende del vehículo seleccionado. Equipaje sobredimensionado, equipos médicos, mascotas u objetos especiales deben informarse antes de confirmar. Cada pasajero conserva la responsabilidad sobre sus objetos personales, salvo responsabilidad legal demostrada."
        ],
        [
          "Capacity depends on the selected vehicle. Oversized luggage, medical equipment, pets or special items must be disclosed before confirmation. Each passenger remains responsible for personal belongings, except where legal liability is established."
        ]
      ),
      section(
        "menores",
        "Menores de edad",
        "Minors",
        [
          "Las reservas que incluyan menores deben ser realizadas o autorizadas por su representante. El adulto responsable debe informar las necesidades de silla, acompañamiento y documentación aplicable."
        ],
        [
          "Bookings including minors must be made or authorized by their representative. The responsible adult must disclose child-seat, supervision and documentation needs."
        ]
      ),
      section(
        "turismo-medico",
        "Turismo médico",
        "Medical travel",
        [
          "El servicio se limita a la coordinación de movilidad. MOVE Colombia no presta servicios médicos, no diagnostica, no recomienda tratamientos y no reemplaza ambulancias ni transporte asistencial. El pasajero debe informar únicamente los datos necesarios para una movilidad segura."
        ],
        [
          "The service is limited to mobility coordination. MOVE Colombia does not provide medical services, diagnoses or treatment recommendations and does not replace ambulances or assisted transport. Passengers should disclose only the information needed for safe mobility."
        ]
      ),
      section(
        "terceros",
        "Servicios prestados por terceros",
        "Third-party services",
        [
          "Guías, entradas, actividades, operadores turísticos, empresas de transporte y otros aliados pueden prestar partes del servicio. Su identidad y condiciones deben informarse cuando corresponda."
        ],
        [
          "Guides, admissions, activities, tour operators, transport companies and other partners may deliver parts of the service. Their identity and conditions must be disclosed when applicable."
        ]
      ),
      section(
        "pqrs",
        "PQRS y reclamación directa",
        "Requests, complaints and direct claims",
        [
          `El usuario puede presentar peticiones, quejas, reclamos o sugerencias a ${company.generalEmail}. Debe incluir nombre, datos de contacto, reserva relacionada, hechos y solicitud concreta.`,
          "La respuesta se entregará dentro de los términos legales aplicables. También está disponible la página de PQRS del sitio."
        ],
        [
          `Users may submit requests, complaints, claims or suggestions to ${company.generalEmail}. The message should include name, contact details, related booking, facts and the specific request.`,
          "A response will be provided within applicable legal time limits. The website PQRS page is also available."
        ]
      ),
      section(
        "consumidor",
        "Protección al consumidor",
        "Consumer protection",
        [
          "Nada en estos términos elimina derechos irrenunciables. El usuario puede acudir a los mecanismos previstos en la Ley 1480 de 2011 y consultar la Superintendencia de Industria y Comercio."
        ],
        [
          "Nothing in these terms removes mandatory consumer rights. Users may rely on the mechanisms provided by Colombian consumer law and consult the Superintendence of Industry and Commerce."
        ]
      ),
      section(
        "propiedad",
        "Propiedad intelectual",
        "Intellectual property",
        [
          "La marca, el diseño, los textos propios, la estructura y los elementos del sitio no pueden reutilizarse comercialmente sin autorización. Las fotografías y contenidos de terceros conservan los derechos de sus titulares."
        ],
        [
          "The brand, design, original text, structure and website elements may not be commercially reused without authorization. Third-party photographs and content remain subject to their owners' rights."
        ]
      ),
      section(
        "datos",
        "Protección de datos",
        "Data protection",
        [
          "El tratamiento de información personal se rige por la política de privacidad. La aceptación de estos términos no reemplaza las autorizaciones específicas exigidas para datos sensibles o finalidades adicionales."
        ],
        [
          "Personal data processing is governed by the privacy policy. Acceptance of these terms does not replace specific authorizations required for sensitive data or additional purposes."
        ]
      ),
      section(
        "ley",
        "Ley aplicable",
        "Applicable law",
        [
          "Estos términos se interpretan bajo la legislación colombiana, sin perjuicio de las normas imperativas que protejan al consumidor o al titular de datos."
        ],
        [
          "These terms are interpreted under Colombian law, without limiting mandatory rules protecting consumers or data subjects."
        ]
      ),
      section(
        "modificaciones",
        "Modificaciones y versión",
        "Changes and version",
        [
          `La versión vigente se identifica como ${company.termsVersion}. Los cambios aplican hacia el futuro y no alteran silenciosamente las condiciones ya confirmadas para una reserva.`
        ],
        [
          `The current version is identified as ${company.termsVersion}. Changes apply prospectively and do not silently alter conditions already confirmed for a booking.`
        ]
      )
    ]
  },
  {
    slug: "privacidad",
    title: {
      ES: "Política de privacidad y tratamiento de datos",
      EN: "Privacy and data processing policy"
    },
    summary: {
      ES: "Borrador informativo sobre la recolección y el uso de datos personales en la navegación, contacto, reserva, pago y operación de servicios.",
      EN: "Informative translation of the draft describing personal data collection and use during browsing, contact, booking, payment and service delivery. The Spanish version prevails pending professional review."
    },
    sections: [
      section(
        "responsable",
        "Responsable y canal",
        "Controller and contact channel",
        [
          `${company.tradeName} actúa como responsable de los datos recolectados directamente mediante el sitio. Las consultas y reclamos se reciben en ${company.generalEmail}. La ciudad principal de operación informada es ${company.principalCity}.`
        ],
        [
          `${company.tradeName} acts as controller for data collected directly through the website. Requests and complaints are received at ${company.generalEmail}. The stated principal city of operation is ${company.principalCity}.`
        ]
      ),
      section(
        "datos-recopilados",
        "Datos recopilados",
        "Data collected",
        [
          "Podemos recopilar nombre, correo, teléfono, ciudad, servicio, fechas, pasajeros, equipaje, origen, destino, identificadores de lugares, observaciones, información de pago confirmada por la pasarela y comunicaciones relacionadas con la reserva."
        ],
        [
          "We may collect name, email, phone, city, service, dates, passengers, luggage, origin, destination, place identifiers, notes, payment status confirmed by the gateway and booking-related communications."
        ]
      ),
      section(
        "sensibles",
        "Datos sensibles y turismo médico",
        "Sensitive data and medical travel",
        [
          "En turismo médico pueden recibirse datos sobre movilidad, acompañamiento o necesidades logísticas. No deben enviarse historias clínicas ni diagnósticos que no sean necesarios. Cuando un dato sensible sea indispensable, se solicitará autorización explícita y se limitará su acceso."
        ],
        [
          "Medical travel requests may include mobility, companion or logistical needs. Users should not send medical records or diagnoses that are unnecessary. When sensitive data is essential, explicit authorization will be requested and access will be restricted."
        ]
      ),
      section(
        "finalidades",
        "Finalidades",
        "Purposes",
        [
          "Los datos se usan para cotizar, validar disponibilidad, coordinar rutas, crear reservas, procesar pagos, enviar confirmaciones, atender solicitudes, prevenir fraude, cumplir obligaciones legales y mejorar la seguridad y calidad del servicio.",
          "No se utilizarán para marketing no solicitado sin una autorización válida."
        ],
        [
          "Data is used to quote, validate availability, coordinate routes, create bookings, process payments, send confirmations, handle requests, prevent fraud, comply with legal duties and improve service safety and quality.",
          "Data will not be used for unsolicited marketing without valid authorization."
        ]
      ),
      section(
        "derechos",
        "Derechos del titular",
        "Data subject rights",
        [
          "El titular puede conocer, actualizar y rectificar sus datos, solicitar prueba de la autorización, conocer el uso realizado, presentar quejas ante la SIC, revocar la autorización o pedir supresión cuando sea procedente y acceder gratuitamente a su información."
        ],
        [
          "Data subjects may access, update and correct data, request proof of authorization, learn how data was used, complain to the SIC, revoke authorization or request deletion when applicable and access their information free of charge."
        ]
      ),
      section(
        "procedimiento",
        "Consultas y reclamos",
        "Requests and complaints",
        [
          `La solicitud debe enviarse a ${company.generalEmail} e incluir identificación, datos de contacto, descripción de los hechos, derecho que desea ejercer y documentos de soporte.`,
          "Las consultas y reclamos se atenderán dentro de los plazos legales aplicables. Si la solicitud está incompleta, se pedirá la información necesaria para continuar."
        ],
        [
          `The request must be sent to ${company.generalEmail} and include identification, contact details, facts, the right being exercised and supporting documents.`,
          "Requests and complaints will be handled within applicable legal time limits. If incomplete, the information needed to continue will be requested."
        ]
      ),
      section(
        "proveedores",
        "Proveedores tecnológicos",
        "Technology providers",
        [
          "El código actual integra o contempla Supabase para autenticación y base de datos, Vercel para alojamiento, Wompi para pagos, Google Maps para lugares y rutas, Resend para correo, WhatsApp para comunicaciones y un servicio de tasa de cambio para mostrar valores de referencia.",
          "Cada proveedor trata la información según su función y sus propias condiciones. No se declara el uso de herramientas de analítica o publicidad porque no están instaladas actualmente."
        ],
        [
          "The current code integrates or supports Supabase for authentication and database services, Vercel for hosting, Wompi for payments, Google Maps for places and routes, Resend for email, WhatsApp for communications and an exchange-rate service for reference values.",
          "Each provider processes information according to its role and terms. No analytics or advertising tools are declared because none are currently installed."
        ]
      ),
      section(
        "transferencias",
        "Transmisiones y transferencias",
        "Processing and international transfers",
        [
          "Algunos proveedores tecnológicos pueden procesar datos fuera de Colombia. Se utilizarán mecanismos contractuales y medidas razonables para limitar el tratamiento a la prestación contratada y a las obligaciones aplicables."
        ],
        [
          "Some technology providers may process data outside Colombia. Contractual mechanisms and reasonable safeguards will be used to limit processing to the contracted service and applicable duties."
        ]
      ),
      section(
        "seguridad",
        "Seguridad y conservación",
        "Security and retention",
        [
          "Se aplican controles técnicos y organizativos razonables, acceso restringido y separación de llaves privadas. Ningún sistema es infalible.",
          "Los datos se conservan durante el tiempo necesario para operar la reserva, atender reclamaciones, cumplir obligaciones y defender derechos. Después se eliminan, anonimizan o bloquean según corresponda."
        ],
        [
          "Reasonable technical and organizational controls, restricted access and separation of private keys are applied. No system is infallible.",
          "Data is retained as needed to operate the booking, handle claims, comply with duties and defend rights. It is then deleted, anonymized or restricted as appropriate."
        ]
      ),
      section(
        "menores",
        "Datos de menores",
        "Children's data",
        [
          "La información de menores solo debe ser suministrada por su representante y cuando sea necesaria para la reserva. Se protegerá su interés superior y se evitarán finalidades incompatibles."
        ],
        [
          "Information about minors should only be provided by their representative and when needed for the booking. Their best interests will be protected and incompatible purposes avoided."
        ]
      ),
      section(
        "cambios",
        "Actualizaciones de la política",
        "Policy updates",
        [
          `La última actualización es ${company.lastUpdated}. Los cambios materiales se publicarán en esta misma ruta.`
        ],
        [
          `The last update is ${company.lastUpdated}. Material changes will be published on this page.`
        ]
      )
    ]
  },
  {
    slug: "cookies",
    title: {
      ES: "Política de cookies y almacenamiento local",
      EN: "Cookie and local storage policy"
    },
    summary: {
      ES: "Explica el uso actual de cookies esenciales de autenticación y preferencias guardadas en el navegador.",
      EN: "Explains the current use of essential authentication cookies and browser-stored preferences."
    },
    sections: [
      section(
        "uso-actual",
        "Uso actual",
        "Current use",
        [
          "El sitio no tiene instaladas herramientas de analítica, publicidad, remarketing ni píxeles de seguimiento. Por esa razón no se muestra un banner genérico de consentimiento para categorías que no existen."
        ],
        [
          "The website has no installed analytics, advertising, remarketing or tracking pixels. Therefore, no generic consent banner is shown for categories that do not exist."
        ]
      ),
      section(
        "esenciales",
        "Cookies esenciales",
        "Essential cookies",
        [
          "Supabase puede usar cookies de sesión para autenticación, actualización de sesión y acceso a áreas administrativas. Son necesarias para la seguridad y el funcionamiento de esas rutas."
        ],
        [
          "Supabase may use session cookies for authentication, session refresh and access to administrative areas. They are required for security and operation of those routes."
        ]
      ),
      section(
        "preferencias",
        "Preferencias de idioma y moneda",
        "Language and currency preferences",
        [
          "El navegador guarda `move_language` y `move_currency` en almacenamiento local para recordar ES/EN y COP/USD. Estas preferencias no se usan para publicidad."
        ],
        [
          "The browser stores `move_language` and `move_currency` in local storage to remember ES/EN and COP/USD. These preferences are not used for advertising."
        ]
      ),
      section(
        "terceros",
        "Servicios de terceros",
        "Third-party services",
        [
          "Google Maps, Wompi, WhatsApp y otros proveedores pueden aplicar sus propias tecnologías cuando el usuario interactúa con sus servicios. Sus condiciones y políticas son independientes."
        ],
        [
          "Google Maps, Wompi, WhatsApp and other providers may apply their own technologies when users interact with their services. Their terms and policies are independent."
        ]
      ),
      section(
        "control",
        "Cómo controlar el almacenamiento",
        "How to control storage",
        [
          "El usuario puede borrar cookies y almacenamiento local desde la configuración del navegador. Esto puede cerrar sesiones o restablecer idioma y moneda."
        ],
        [
          "Users can delete cookies and local storage through browser settings. This may sign them out or reset language and currency."
        ]
      ),
      section(
        "cambios",
        "Cambios futuros",
        "Future changes",
        [
          "Si se incorporan cookies no esenciales, analítica o marketing, se actualizará esta política y se implementará consentimiento previo y granular antes de activarlas."
        ],
        [
          "If non-essential cookies, analytics or marketing are added, this policy will be updated and prior granular consent will be implemented before activation."
        ]
      )
    ]
  },
  {
    slug: "cancelaciones-y-reembolsos",
    title: {
      ES: "Cancelaciones, cambios y reembolsos",
      EN: "Cancellations, changes and refunds"
    },
    summary: {
      ES: "Estructura transparente para gestionar solicitudes sin inventar porcentajes, penalidades o plazos que todavía no han sido aprobados.",
      EN: "Transparent framework for handling requests without inventing percentages, penalties or deadlines that have not been approved."
    },
    sections: [
      section(
        "principio",
        "Regla principal",
        "Main rule",
        [
          "Las condiciones específicas de cancelación deben mostrarse antes del pago y quedar incluidas en la confirmación. Si una condición no fue informada, no se incorporará posteriormente de forma silenciosa."
        ],
        [
          "Specific cancellation conditions must be shown before payment and included in the confirmation. A condition that was not disclosed will not be silently added later."
        ]
      ),
      section(
        "solicitud",
        "Cómo solicitar un cambio",
        "How to request a change",
        [
          `Escribe a ${company.generalEmail} o utiliza WhatsApp indicando nombre, número de reserva, ciudad, fecha, servicio y cambio solicitado.`
        ],
        [
          `Write to ${company.generalEmail} or use WhatsApp and include name, booking number, city, date, service and requested change.`
        ]
      ),
      section(
        "tipos",
        "Evaluación por tipo de servicio",
        "Assessment by service type",
        [
          "Traslados de aeropuerto, punto a punto, servicios por horas, tours, servicios corporativos y actividades de terceros se evalúan por separado porque sus costos y compromisos operativos son distintos."
        ],
        [
          "Airport transfers, point-to-point rides, hourly services, tours, corporate services and third-party activities are assessed separately because their costs and operational commitments differ."
        ]
      ),
      section(
        "no-show",
        "No-show",
        "No-show",
        [
          "Si el pasajero no se presenta, se revisarán la hora acordada, los intentos de contacto, la presencia del vehículo, los tiempos de espera informados y los costos efectivamente causados antes de decidir."
        ],
        [
          "If the passenger does not appear, the agreed time, contact attempts, vehicle presence, disclosed waiting time and actual incurred costs will be reviewed before a decision."
        ]
      ),
      section(
        "vuelos",
        "Retrasos de vuelo",
        "Flight delays",
        [
          "Cuando se haya informado correctamente el vuelo, MOVE Colombia intentará ajustar la recogida según monitoreo y disponibilidad. Cambios de aeropuerto, fecha o vuelo deben comunicarse tan pronto como sea posible."
        ],
        [
          "When correct flight information was provided, MOVE Colombia will attempt to adjust pickup according to monitoring and availability. Changes to airport, date or flight should be communicated as soon as possible."
        ]
      ),
      section(
        "clima",
        "Clima, cierres y fuerza mayor",
        "Weather, closures and force majeure",
        [
          "Si una actividad no puede realizarse por clima, cierre, restricción de autoridad o evento externo, se evaluará reprogramación, sustitución, crédito o reembolso según la parte no prestada y los costos de terceros."
        ],
        [
          "If an activity cannot operate due to weather, closure, authority restriction or external event, rescheduling, substitution, credit or refund will be assessed based on the undelivered portion and third-party costs."
        ]
      ),
      section(
        "reembolsos",
        "Procesamiento de reembolsos",
        "Refund processing",
        [
          "Todo reembolso aprobado se gestiona por el medio disponible y puede depender de los tiempos de Wompi, la entidad financiera o el proveedor tercero. El plazo estimado se informará al aprobar la solicitud, sin prometer un término no confirmado."
        ],
        [
          "Approved refunds are processed through the available method and may depend on Wompi, the financial institution or a third-party provider. An estimate will be communicated upon approval without promising an unconfirmed deadline."
        ]
      ),
      section(
        "derechos",
        "Derechos del consumidor",
        "Consumer rights",
        [
          "Esta política no limita garantías, retracto, reversión del pago u otros derechos cuando legalmente sean aplicables. Cada caso se revisa con la información de la transacción."
        ],
        [
          "This policy does not limit warranties, withdrawal, payment reversal or other rights where legally applicable. Each case is reviewed using transaction information."
        ]
      )
    ]
  },
  {
    slug: "pqrs",
    title: {
      ES: "Peticiones, quejas, reclamos y sugerencias",
      EN: "Requests, complaints, claims and suggestions"
    },
    summary: {
      ES: "Canal para solicitar información, ejercer derechos, reportar problemas o presentar una reclamación directa.",
      EN: "Channel to request information, exercise rights, report issues or submit a direct claim."
    },
    sections: [
      section(
        "canal",
        "Canal de recepción",
        "Submission channel",
        [
          `Envía tu PQRS a ${company.generalEmail}. También puedes comunicarte al ${company.phone}.`
        ],
        [
          `Send your request to ${company.generalEmail}. You may also call ${company.phone}.`
        ]
      ),
      section(
        "contenido",
        "Información necesaria",
        "Required information",
        [
          "Incluye nombre, correo o teléfono, número de reserva si existe, descripción clara de los hechos, fecha, ciudad, solicitud concreta y documentos o evidencias relevantes."
        ],
        [
          "Include name, email or phone, booking number if available, a clear description of the facts, date, city, specific request and relevant documents or evidence."
        ]
      ),
      section(
        "tramite",
        "Trámite",
        "Process",
        [
          "MOVE Colombia confirmará la recepción, verificará si la solicitud está completa y realizará la revisión operativa o de datos correspondiente. Si falta información, podrá solicitarla antes de resolver."
        ],
        [
          "MOVE Colombia will acknowledge receipt, verify completeness and conduct the relevant operational or data review. Missing information may be requested before resolution."
        ]
      ),
      section(
        "terminos",
        "Términos de respuesta",
        "Response time",
        [
          "La respuesta se entregará dentro de los términos legales aplicables al tipo de solicitud. Cuando una autoridad, pasarela o proveedor tercero deba aportar información, se comunicará esa dependencia."
        ],
        [
          "A response will be provided within the legal time limit applicable to the request type. When an authority, payment gateway or third party must provide information, that dependency will be communicated."
        ]
      ),
      section(
        "datos",
        "Solicitudes sobre datos personales",
        "Personal data requests",
        [
          "Para conocer, actualizar, rectificar, suprimir o revocar autorización sobre datos personales, identifica expresamente el derecho que deseas ejercer y adjunta la información que permita validar tu identidad."
        ],
        [
          "To access, update, correct, delete or revoke authorization for personal data, clearly state the right being exercised and provide information that allows identity verification."
        ]
      ),
      section(
        "autoridad",
        "Protección del consumidor",
        "Consumer protection",
        [
          "La reclamación directa no impide acudir a la Superintendencia de Industria y Comercio cuando corresponda. El sitio mantiene un enlace visible a la página oficial de la SIC."
        ],
        [
          "A direct claim does not prevent contacting the Superintendence of Industry and Commerce where applicable. The website maintains a visible link to the official SIC website."
        ]
      )
    ]
  }
];

export const legalDocumentSlugs = legalDocuments.map((document) => document.slug);

export function getLegalDocument(slug: string) {
  return legalDocuments.find((document) => document.slug === slug);
}
