"use client";

import "../styles/globals.css";

import { useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { WeatherDashboard } from "./weather/weather-dashboard";
import { SearchBar } from "./weather/search-bar";
import { LocationList } from "./weather/location-list";
import { v4 as uuidv4 } from "uuid";
import { LocationData, SavedLocation } from "../lib/types/weather";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@components/common/ui/button";

export default function KohaWeather() {
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [activeLocation, setActiveLocation] = useState<SavedLocation | null>(
    null,
  );
  const [currentLocation, setCurrentLocation] = useState<SavedLocation | null>(
    null,
  );

  const getCurrentLocation = async () => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000, // Increased timeout to 10 seconds
              maximumAge: 0,
            });
          },
        );

        const { latitude: lat, longitude: lon } = position.coords;
        try {
          const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}&count=1`,
          );

          if (!response.ok) {
            throw new Error("Failed to fetch location data");
          }

          const data = await response.json();

          if (data.results?.[0]) {
            const locationData = data.results[0];
            const location: SavedLocation = {
              id: "current-location",
              lat,
              lon,
              name: locationData.name || "Current Location",
              country: locationData.country || "",
            };
            setCurrentLocation(location);
            return location;
          } else {
            // Fallback if no reverse geocoding results
            const location: SavedLocation = {
              id: "current-location",
              lat,
              lon,
              name: "Current Location",
              country: "",
            };
            setCurrentLocation(location);
            return location;
          }
        } catch (error) {
          // Fallback if reverse geocoding fails
          console.error("Error getting location name:", error);
          const location: SavedLocation = {
            id: "current-location",
            lat,
            lon,
            name: "Current Location",
            country: "",
          };
          setCurrentLocation(location);
          return location;
        }
      } catch (error) {
        console.error("Error getting current location:", error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const initializeLocations = async () => {
      try {
        // Get current location first
        const current = await getCurrentLocation();

        // Load saved locations from localStorage
        const savedLocations = localStorage.getItem("savedLocations");
        let parsedLocations: SavedLocation[] = [];

        if (savedLocations) {
          parsedLocations = JSON.parse(savedLocations);
          // Remove any old current location entries
          parsedLocations = parsedLocations.filter(
            (loc) => loc.id !== "current-location",
          );
        }

        // Add current location at the start if available
        const finalLocations = current
          ? [current, ...parsedLocations]
          : parsedLocations;

        setLocations(finalLocations);
        setActiveLocation(current || finalLocations[0] || null);

        // Save to localStorage without the current location
        localStorage.setItem("savedLocations", JSON.stringify(parsedLocations));
      } catch (error) {
        console.error("Error initializing locations:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeLocations();
  }, []);

  const handleLocationSelect = (location: LocationData) => {
    const newLocation: SavedLocation = {
      ...location,
      id: uuidv4(),
    };

    setLocations((prev) => {
      const locationExists = prev.some(
        (loc) => loc.lat === location.lat && loc.lon === location.lon,
      );

      if (locationExists) {
        return prev;
      }

      const newLocations = [...prev, newLocation];
      // Save to localStorage without the current location
      const locationsToSave = newLocations.filter(
        (loc) => loc.id !== "current-location",
      );
      localStorage.setItem("savedLocations", JSON.stringify(locationsToSave));
      return newLocations;
    });

    setActiveLocation(newLocation);
  };

  const handleLocationRemove = (locationId: string) => {
    // Prevent removing current location
    if (locationId === "current-location") return;

    setLocations((prev) => {
      const newLocations = prev.filter((loc) => loc.id !== locationId);

      if (activeLocation?.id === locationId) {
        setActiveLocation(currentLocation || newLocations[0] || null);
      }

      // Save to localStorage without the current location
      const locationsToSave = newLocations.filter(
        (loc) => loc.id !== "current-location",
      );
      localStorage.setItem("savedLocations", JSON.stringify(locationsToSave));
      return newLocations;
    });
  };

  const handleClearLocations = () => {
    // Keep only the current location
    const newLocations = currentLocation ? [currentLocation] : [];
    setLocations(newLocations);
    setActiveLocation(currentLocation || null);
    localStorage.setItem("savedLocations", JSON.stringify([]));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 flex items-center justify-between rounded-xl border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:bg-gray-900">
          <h1 className="text-2xl font-bold">Weather Dashboard</h1>
          <div className="flex items-center gap-4">
            <SearchBar onLocationSelect={handleLocationSelect} />
            <ThemeToggle />
          </div>
        </nav>
        {locations.length > (currentLocation ? 1 : 0) && (
          <div className="mb-8 flex items-center justify-between">
            <LocationList
              locations={locations}
              activeLocation={activeLocation}
              onLocationSelect={setActiveLocation}
              onLocationRemove={handleLocationRemove}
              currentLocationId="current-location"
            />
            <Button
              variant="destructive"
              className="border-2 border-black"
              onClick={handleClearLocations}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        )}
        <WeatherDashboard location={activeLocation} />
      </div>
    </main>
  );
}
