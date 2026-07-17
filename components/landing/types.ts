import type { City, Service, Tour } from "@/lib/domain/types";

export type LandingTour = Tour & {
  shortDescription: {
    ES: string;
    EN: string;
  };
};

export type LandingCityOption = {
  city: City;
  displayName: string;
  coverage: {
    ES: string;
    EN: string;
  };
  featuredTours: LandingTour[];
};

export type LandingService = Service & {
  displayTitle: {
    ES: string;
    EN: string;
  };
  shortDescription: {
    ES: string;
    EN: string;
  };
};
