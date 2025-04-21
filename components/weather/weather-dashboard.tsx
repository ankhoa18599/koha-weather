"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { CurrentWeather } from "./current-weather";
import { ForecastChart } from "./forecast-chart";
import { WeatherAlerts } from "./weather-alerts";
import {
  LocationData,
  WeatherData,
  WeatherError,
} from "../../lib/types/weather";
import { getWeatherData } from "../../lib/api/weather";
import { Card } from "@components/common/ui/card";

interface WeatherDashboardProps {
  location: LocationData | null;
}

export function WeatherDashboard({ location }: WeatherDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<WeatherError | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    async function fetchWeatherData() {
      if (!location) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getWeatherData(location.lat, location.lon);
        setWeatherData(data);
      } catch (err) {
        setError({ message: "Failed to fetch weather data" });
      } finally {
        setLoading(false);
      }
    }

    fetchWeatherData();
  }, [location]);

  if (!location) {
    return (
      <Card className="border-4 border-black p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-lg">
          Search for a location to see weather information
        </p>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card
            key={i}
            className="h-[200px] animate-pulse border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-4 border-red-500 p-6 text-center shadow-[8px_8px_0px_0px_rgba(239,68,68,1)]">
        <p className="text-lg font-bold text-red-500">{error.message}</p>
      </Card>
    );
  }

  if (!weatherData) {
    return (
      <Card className="border-4 border-black p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-lg">No weather data available</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-xl font-bold">
          Weather for {location.name}, {location.country}
        </h2>
      </Card>
      <WeatherAlerts data={weatherData} />
      <CurrentWeather data={weatherData} />
      <ForecastChart data={weatherData} />
    </div>
  );
}
