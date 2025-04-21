"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import { Navigation, Sun, Sunrise, Sunset, Umbrella, Wind } from "lucide-react";
import { WeatherData } from "../../lib/types/weather";
import { Card } from "@components/common/ui/card";

interface ForecastChartProps {
  data: WeatherData;
}

export function ForecastChart({ data }: ForecastChartProps) {
  const chartData = data.daily.map((day) => ({
    date: format(new Date(day.dt * 1000), "EEE"),
    min: day.temp.min,
    max: day.temp.max,
    feelsLikeMin: day.feelsLike.min,
    feelsLikeMax: day.feelsLike.max,
    precipitation: day.precipitation,
    precipitationHours: day.precipitationHours,
    precipitationProbability: day.precipitationProbability,
    windSpeed: day.windSpeed,
    windGust: day.windGust,
    windDirection: day.windDirection,
    uvIndex: day.uvIndex,
    sunrise: format(new Date(day.sunrise * 1000), "HH:mm"),
    sunset: format(new Date(day.sunset * 1000), "HH:mm"),
    description: day.weather[0].description,
  }));

  return (
    <div className="grid gap-4">
      <Card className="border-4 border-black bg-gradient-to-br from-blue-50 to-purple-50 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:from-blue-950 dark:to-purple-950">
        <h2 className="mb-4 text-2xl font-bold">Temperature Forecast</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="max"
                stroke="hsl(var(--chart-1))"
                strokeWidth={3}
                dot={{ strokeWidth: 2 }}
                name="Max Temp °C"
              />
              <Line
                type="monotone"
                dataKey="min"
                stroke="hsl(var(--chart-2))"
                strokeWidth={3}
                dot={{ strokeWidth: 2 }}
                name="Min Temp °C"
              />
              <Line
                type="monotone"
                dataKey="feelsLikeMax"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                dot={{ strokeWidth: 1 }}
                name="Feels Like Max °C"
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="feelsLikeMin"
                stroke="hsl(var(--chart-4))"
                strokeWidth={2}
                dot={{ strokeWidth: 1 }}
                name="Feels Like Min °C"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="border-4 border-black bg-gradient-to-br from-green-50 to-blue-50 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:from-green-950 dark:to-blue-950">
        <h2 className="mb-4 text-2xl font-bold">Precipitation & Wind</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="precipitation"
                stroke="hsl(var(--chart-3))"
                strokeWidth={3}
                dot={{ strokeWidth: 2 }}
                name="Precipitation (mm)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="windSpeed"
                stroke="hsl(var(--chart-4))"
                strokeWidth={3}
                dot={{ strokeWidth: 2 }}
                name="Wind Speed (km/h)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="windGust"
                stroke="hsl(var(--chart-5))"
                strokeWidth={2}
                dot={{ strokeWidth: 1 }}
                name="Wind Gusts (km/h)"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-4 border-black bg-gradient-to-r from-orange-50 to-yellow-50 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:from-orange-950 dark:to-yellow-950">
          <h2 className="mb-4 text-2xl font-bold">Daily Details</h2>
          <div className="grid gap-4">
            {chartData.map((day, index) => (
              <div
                key={index}
                className="rounded-lg bg-white/50 p-4 dark:bg-black/20"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">{day.date}</h3>
                  <span className="text-sm">{day.description}</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Umbrella className="h-5 w-5 text-blue-500" />
                    <span>{day.precipitationProbability}% chance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-amber-500" />
                    <span>UV {day.uvIndex}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-sky-500" />
                    <span>{day.windSpeed} km/h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-indigo-500" />
                    <span>{day.windDirection}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-4 border-black bg-gradient-to-r from-pink-50 to-purple-50 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:from-pink-950 dark:to-purple-950">
          <h2 className="mb-4 text-2xl font-bold">Sunrise & Sunset</h2>
          <div className="grid gap-4">
            {chartData.map((day, index) => (
              <div
                key={index}
                className="rounded-lg bg-white/50 p-4 dark:bg-black/20"
              >
                <h3 className="font-bold">{day.date}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <Sunrise className="h-5 w-5 text-orange-500" />
                  <span>{day.sunrise}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Sunset className="h-5 w-5 text-purple-500" />
                  <span>{day.sunset}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
