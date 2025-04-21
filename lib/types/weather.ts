export interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    windGust: number;
    precipitation: number;
    cloudCover: number;
    pressure: number;
    visibility: number;
    uvIndex: number;
    isDay: number;
    description: string;
    icon: string;
  };
  daily: Array<{
    dt: number;
    sunrise: number;
    sunset: number;
    temp: {
      min: number;
      max: number;
    };
    feelsLike: {
      min: number;
      max: number;
    };
    precipitation: number;
    precipitationHours: number;
    precipitationProbability: number;
    windSpeed: number;
    windGust: number;
    windDirection: string;
    uvIndex: number;
    weather: Array<{
      description: string;
      icon: string;
    }>;
  }>;
  alerts?: Array<{
    event: string;
    description: string;
    start: number;
    end: number;
  }>;
}

export interface LocationData {
  lat: number;
  lon: number;
  name: string;
  country: string;
}

export interface WeatherError {
  message: string;
  code?: string;
}

export interface SavedLocation extends LocationData {
  id: string;
}