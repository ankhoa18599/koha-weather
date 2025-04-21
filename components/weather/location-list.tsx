"use client";

import { MapPin, Navigation, X } from "lucide-react";
import { SavedLocation } from "../../lib/types/weather";
import { Button } from "@components/common/ui/button";

interface LocationListProps {
  locations: SavedLocation[];
  activeLocation: SavedLocation | null;
  onLocationSelect: (location: SavedLocation) => void;
  onLocationRemove: (locationId: string) => void;
  currentLocationId: string;
}

export function LocationList({
  locations,
  activeLocation,
  onLocationSelect,
  onLocationRemove,
  currentLocationId,
}: LocationListProps) {
  if (!locations.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {locations.map((location) => (
        <Button
          key={location.id}
          variant={activeLocation?.id === location.id ? "default" : "outline"}
          className={`group relative border-2 ${
            activeLocation?.id === location.id
              ? "border-primary"
              : "border-black"
          }`}
          onClick={() => onLocationSelect(location)}
        >
          {location.id === currentLocationId ? (
            <Navigation className="mr-2 h-4 w-4" />
          ) : (
            <MapPin className="mr-2 h-4 w-4" />
          )}
          {location.name}, {location.country}
          {location.id !== currentLocationId && (
            <button
              className="absolute -right-2 -top-2 hidden rounded-full border-2 border-black bg-white p-1 text-black hover:bg-red-100 group-hover:block dark:bg-gray-800 dark:text-white"
              onClick={(e) => {
                e.stopPropagation();
                onLocationRemove(location.id);
              }}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </Button>
      ))}
    </div>
  );
}
