"use client";

import {
  Cloud,
  Droplets,
  Eye,
  Gauge,
  Navigation,
  Sun,
  Thermometer,
  Umbrella,
  Wind,
} from "lucide-react";
import { WeatherData } from "../../lib/types/weather";
import { Card } from "@components/common/ui/card";

interface CurrentWeatherProps {
  data: WeatherData;
}

const getWeatherColor = (temp: number) => {
  if (temp <= 0)
    return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300";
  if (temp <= 10)
    return "bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300";
  if (temp <= 20)
    return "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300";
  if (temp <= 30)
    return "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300";
  return "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300";
};

export function CurrentWeather({ data }: CurrentWeatherProps) {
  const { current } = data;
  const tempColor = getWeatherColor(current.temp);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card
        className={`border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${tempColor}`}
      >
        <div className="flex items-center gap-3">
          <Thermometer className="h-6 w-6" />
          <h2 className="text-xl font-bold">Temperature</h2>
        </div>
        <div className="mt-4 text-4xl font-bold">
          {current.temp.toFixed(1)}°C
        </div>
        <p className="mt-2">Feels like {current.feelsLike.toFixed(1)}°C</p>
        <p className="mt-2 capitalize">{current.description}</p>
        <p className="mt-2">{current.isDay ? "Day" : "Night"}</p>
      </Card>

      <Card className="border-4 border-black bg-purple-100 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:bg-purple-950">
        <div className="flex items-center gap-3">
          <Droplets className="h-6 w-6 text-purple-700 dark:text-purple-300" />
          <h2 className="text-xl font-bold text-purple-700 dark:text-purple-300">
            Humidity & Rain
          </h2>
        </div>
        <div className="mt-4 text-4xl font-bold text-purple-700 dark:text-purple-300">
          {current.humidity}%
        </div>
        <p className="mt-2 text-purple-700 dark:text-purple-300">
          Precipitation: {current.precipitation} mm
        </p>
      </Card>

      <Card className="border-4 border-black bg-sky-100 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:bg-sky-950">
        <div className="flex items-center gap-3">
          <Wind className="h-6 w-6 text-sky-700 dark:text-sky-300" />
          <h2 className="text-xl font-bold text-sky-700 dark:text-sky-300">
            Wind
          </h2>
        </div>
        <div className="mt-4 text-4xl font-bold text-sky-700 dark:text-sky-300">
          {current.windSpeed} km/h
        </div>
        <div className="mt-2 flex items-center gap-2 text-sky-700 dark:text-sky-300">
          <Navigation
            className="h-4 w-4"
            style={{ transform: `rotate(${current.windDirection}deg)` }}
          />
          <span>{current.windDirection}</span>
        </div>
        <p className="mt-2 text-sky-700 dark:text-sky-300">
          Gusts up to {current.windGust} km/h
        </p>
      </Card>

      <Card className="border-4 border-black bg-gray-100 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:bg-gray-950">
        <div className="flex items-center gap-3">
          <Cloud className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">
            Cloud Cover
          </h2>
        </div>
        <div className="mt-4 text-4xl font-bold text-gray-700 dark:text-gray-300">
          {current.cloudCover}%
        </div>
      </Card>

      <Card className="border-4 border-black bg-emerald-100 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:bg-emerald-950">
        <div className="flex items-center gap-3">
          <Gauge className="h-6 w-6 text-emerald-700 dark:text-emerald-300" />
          <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
            Pressure
          </h2>
        </div>
        <div className="mt-4 text-4xl font-bold text-emerald-700 dark:text-emerald-300">
          {current.pressure} hPa
        </div>
      </Card>

      <Card className="border-4 border-black bg-amber-100 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:bg-amber-950">
        <div className="flex items-center gap-3">
          <Sun className="h-6 w-6 text-amber-700 dark:text-amber-300" />
          <h2 className="text-xl font-bold text-amber-700 dark:text-amber-300">
            UV Index
          </h2>
        </div>
        <div className="mt-4 text-4xl font-bold text-amber-700 dark:text-amber-300">
          {current.uvIndex}
        </div>
        <p className="mt-2 text-amber-700 dark:text-amber-300">
          {current.uvIndex <= 2
            ? "Low"
            : current.uvIndex <= 5
              ? "Moderate"
              : current.uvIndex <= 7
                ? "High"
                : current.uvIndex <= 10
                  ? "Very High"
                  : "Extreme"}
        </p>
      </Card>

      <Card className="border-4 border-black bg-indigo-100 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:bg-indigo-950">
        <div className="flex items-center gap-3">
          <Eye className="h-6 w-6 text-indigo-700 dark:text-indigo-300" />
          <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
            Visibility
          </h2>
        </div>
        <div className="mt-4 text-4xl font-bold text-indigo-700 dark:text-indigo-300">
          {(current.visibility / 1000).toFixed(1)} km
        </div>
      </Card>
    </div>
  );
}
