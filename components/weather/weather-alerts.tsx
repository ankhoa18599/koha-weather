"use client";

import { AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { WeatherData } from "../../lib/types/weather";
import { Card } from "@components/common/ui/card";

interface WeatherAlertsProps {
  data: WeatherData;
}

export function WeatherAlerts({ data }: WeatherAlertsProps) {
  if (!data.alerts?.length) {
    return null;
  }

  return (
    <Card className="border-4 border-red-500 bg-red-50 p-6 shadow-[8px_8px_0px_0px_rgba(239,68,68,1)] dark:bg-red-950">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-6 w-6 text-red-500" />
        <h2 className="text-xl font-bold text-red-500">Weather Alerts</h2>
      </div>
      <div className="mt-4 space-y-4">
        {data.alerts.map((alert, index) => (
          <div
            key={index}
            className="rounded-lg border-2 border-red-500 bg-white p-4 dark:bg-red-900"
          >
            <h3 className="font-bold text-red-500">{alert.event}</h3>
            <p className="mt-2 text-sm">{alert.description}</p>
            <p className="mt-2 text-sm text-red-500">
              {format(new Date(alert.start * 1000), "PPp")} -{" "}
              {format(new Date(alert.end * 1000), "PPp")}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
