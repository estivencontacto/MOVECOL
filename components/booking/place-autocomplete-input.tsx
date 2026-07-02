"use client";

import { MapPin } from "lucide-react";
import { useEffect, useRef } from "react";
import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type GooglePlaceResult, useGoogleMaps } from "./google-maps";

export type PlaceSelection = {
  label: string;
  placeId?: string;
};

type PlaceAutocompleteInputProps = Omit<InputProps, "onChange" | "value"> & {
  apiKey?: string;
  onPlaceSelect: (place: PlaceSelection) => void;
  onValueChange: (value: string) => void;
  value: string;
};

export function PlaceAutocompleteInput({
  apiKey,
  className,
  onPlaceSelect,
  onValueChange,
  value,
  ...props
}: PlaceAutocompleteInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onPlaceSelectRef = useRef(onPlaceSelect);
  const onValueChangeRef = useRef(onValueChange);
  const { maps, status } = useGoogleMaps(apiKey);

  useEffect(() => {
    onPlaceSelectRef.current = onPlaceSelect;
    onValueChangeRef.current = onValueChange;
  }, [onPlaceSelect, onValueChange]);

  useEffect(() => {
    if (!maps || !inputRef.current) return;

    const autocomplete = new maps.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "co" },
      fields: ["formatted_address", "name", "place_id"],
      strictBounds: false
    });

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const label = getPlaceLabel(place, inputRef.current?.value ?? "");

      if (label) {
        onValueChangeRef.current(label);
        onPlaceSelectRef.current({
          label,
          placeId: place.place_id
        });
      }
    });

    return () => {
      listener.remove();
      maps.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [maps]);

  return (
    <div className="relative">
      <MapPin
        className={cn(
          "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2",
          status === "ready" ? "text-primary" : "text-muted-foreground"
        )}
        aria-hidden
      />
      <Input
        ref={inputRef}
        autoComplete="off"
        className={cn("pl-10", className)}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        {...props}
      />
    </div>
  );
}

function getPlaceLabel(place: GooglePlaceResult, fallback: string) {
  return place.formatted_address ?? place.name ?? fallback;
}
