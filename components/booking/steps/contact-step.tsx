"use client";

import Link from "next/link";
import { ArrowLeft, CreditCard, Mail, MessageCircle, MessageSquare, Phone, UserRound } from "lucide-react";
import type { FieldErrors } from "react-hook-form";
import type { BookingLanguage } from "@/components/booking/booking-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ReservationInput } from "@/lib/domain/schemas";

export function ContactStep({
  customer,
  countryCode,
  notes,
  termsAccepted,
  language,
  errors,
  pending,
  quoteOnly,
  onCustomerChange,
  onCountryCodeChange,
  onNotesChange,
  onTermsChange,
  onBack
}: {
  customer: ReservationInput["customer"];
  countryCode: string;
  notes: string;
  termsAccepted: boolean;
  language: BookingLanguage;
  errors: FieldErrors<ReservationInput>;
  pending: boolean;
  quoteOnly: boolean;
  onCustomerChange: (field: keyof ReservationInput["customer"], value: string) => void;
  onCountryCodeChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onTermsChange: (value: boolean) => void;
  onBack: () => void;
}) {
  return (
    <section aria-labelledby="contact-title">
      <h2 id="contact-title" className="text-2xl font-bold sm:text-3xl">
        {language === "EN" ? "Your details and payment" : "Tus datos y pago"}
      </h2>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <ContactField id="full-name" label={language === "EN" ? "Full name" : "Nombre completo"} icon={UserRound} error={errors.customer?.fullName?.message}>
          <Input id="full-name" value={customer.fullName} onChange={(event) => onCustomerChange("fullName", event.target.value)} placeholder={language === "EN" ? "First and last name" : "Nombre y apellido"} aria-invalid={Boolean(errors.customer?.fullName)} />
        </ContactField>
        <ContactField id="email" label={language === "EN" ? "Email" : "Correo"} icon={Mail} error={errors.customer?.email?.message}>
          <Input id="email" type="email" value={customer.email} onChange={(event) => onCustomerChange("email", event.target.value)} placeholder="tu@correo.com" aria-invalid={Boolean(errors.customer?.email)} />
        </ContactField>
        <ContactField id="country-code" label={language === "EN" ? "Country code" : "Código de país"} icon={Phone}>
          <Select id="country-code" value={countryCode} onChange={(event) => onCountryCodeChange(event.target.value)}>
            <option value="+57">Colombia +57</option>
            <option value="+1">EE. UU. / Canadá +1</option>
            <option value="+34">España +34</option>
            <option value="+52">México +52</option>
            <option value="+51">Perú +51</option>
            <option value="+56">Chile +56</option>
          </Select>
        </ContactField>
        <ContactField id="phone" label={language === "EN" ? "Phone" : "Teléfono"} icon={Phone} error={errors.customer?.phone?.message}>
          <Input id="phone" type="tel" value={customer.phone} onChange={(event) => onCustomerChange("phone", event.target.value)} placeholder={language === "EN" ? "e.g. 300 123 4567" : "Ej. 300 123 4567"} aria-invalid={Boolean(errors.customer?.phone)} />
        </ContactField>
        <div className="md:col-span-2">
          <ContactField id="notes" label={language === "EN" ? "Final notes" : "Observaciones finales"} icon={MessageSquare}>
            <Textarea id="notes" value={notes} onChange={(event) => onNotesChange(event.target.value)} placeholder={language === "EN" ? "Optional instructions for your trip" : "Indicaciones opcionales para tu recorrido"} maxLength={800} />
          </ContactField>
        </div>
      </div>

      <div className="mt-6">
        <label className="flex items-start gap-3 border bg-background p-4 text-sm leading-6">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(event) => onTermsChange(event.target.checked)}
            className="mt-1 size-4 shrink-0 accent-primary"
            aria-invalid={Boolean(errors.termsAccepted)}
            aria-describedby={errors.termsAccepted ? "terms-error" : undefined}
          />
          <span>
            {language === "EN" ? "I have read and accept the " : "He leído y acepto los "}
            <Link href="/legal/terminos-y-condiciones" target="_blank" className="font-semibold text-primary underline underline-offset-4">
              {language === "EN" ? "Terms and conditions" : "Términos y condiciones"}
            </Link>
            {language === "EN" ? " and the " : " y la "}
            <Link href="/legal/privacidad" target="_blank" className="font-semibold text-primary underline underline-offset-4">
              {language === "EN" ? "Privacy policy" : "Política de privacidad"}
            </Link>.
          </span>
        </label>
        {errors.termsAccepted?.message ? <p id="terms-error" role="alert" className="mt-2 text-xs text-destructive">{errors.termsAccepted.message}</p> : null}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button type="button" size="lg" variant="outline" onClick={onBack}><ArrowLeft className="size-4" aria-hidden /> {language === "EN" ? "Back" : "Volver"}</Button>
        <Button type="submit" size="lg" disabled={pending} className="hidden lg:inline-flex">
          {quoteOnly ? <MessageCircle className="size-4" aria-hidden /> : <CreditCard className="size-4" aria-hidden />}
          {pending
            ? (language === "EN" ? "Processing..." : "Procesando...")
            : quoteOnly
              ? (language === "EN" ? "Consult via WhatsApp" : "Consultar por WhatsApp")
              : (language === "EN" ? "Continue to payment" : "Continuar al pago")}
        </Button>
      </div>
      {quoteOnly ? (
        <p className="mt-3 text-right text-xs text-muted-foreground">
          {language === "EN"
            ? "The route will be sent to a MOVE advisor. No payment will be generated."
            : "El recorrido se enviará a un asesor MOVE. No se generará ningún pago."}
        </p>
      ) : null}
    </section>
  );
}

function ContactField({
  id,
  label,
  icon: Icon,
  error,
  children
}: {
  id: string;
  label: string;
  icon: typeof UserRound;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id} className="flex items-center gap-2"><Icon className="size-4 text-primary" aria-hidden /> {label}</Label>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-2 text-xs text-destructive" role="alert">{error}</p> : null}
    </div>
  );
}
