export type UserRole = "admin" | "operator" | "driver" | "customer";

export type ServiceCategory =
  | "airport-transfer"
  | "transfers"
  | "hourly"
  | "medical-tourism"
  | "corporate"
  | "events"
  | "private-tour";

export type ReservationStatus =
  | "draft"
  | "pending"
  | "pending_payment"
  | "confirmed"
  | "accepted"
  | "en_route"
  | "started"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "cancelled" | "refunded";

export type VehicleType = "sedan" | "suv" | "six-passenger" | "van" | "bus";

export type City = {
  id: string;
  name: string;
  slug: string;
  heroTitle?: string;
  heroSubtitle?: string;
  headline: string;
  description: string;
  airport: string;
  image: string;
  heroImage?: string;
  heroGallery?: string[];
  videoUrl?: string;
  serviceIds?: string[];
  mapCenter: { lat: number; lng: number };
  altitudeMeters: number;
  timeZone: string;
  active: boolean;
};

export type Tour = {
  id: string;
  citySlug: string;
  name: string;
  slug: string;
  description: string;
  includes: string[];
  excludes: string[];
  duration: string;
  schedules: string[];
  basePrice: number;
  pricingMode?: "per-person" | "global";
  minimumPassengers?: number;
  heroImage?: string;
  cardImage?: string;
  gallery: string[];
  videoUrl?: string;
  recommendations?: string[];
  keywords?: string[];
  featured?: boolean;
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  category: ServiceCategory;
  description: string;
  heroImage?: string;
  cardImage?: string;
  gallery?: string[];
  benefits: string[];
  process: string[];
  faqs: Array<{ question: string; answer: string }>;
};

export type Vehicle = {
  id: string;
  type: VehicleType;
  name: string;
  capacity: number;
  luggage: number | null;
  image: string;
  description: string;
  available: boolean;
};
