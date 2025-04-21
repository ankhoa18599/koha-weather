const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1';
const GEO_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';

export async function getWeatherData(lat: number, lon: number) {
  try {
    const response = await fetch(
      `${WEATHER_BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code,apparent_temperature,precipitation,cloud_cover,surface_pressure,visibility,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,uv_index_max,sunrise,sunset,precipitation_hours,precipitation_probability_mean&timezone=auto&forecast_days=7`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();

    const getWeatherDescription = (code: number) => {
      const weatherCodes: { [key: number]: string } = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail',
      };
      return weatherCodes[code] || 'Unknown';
    };

    const getWindDirection = (degrees: number) => {
      const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 22.5) % 16;
      return directions[index];
    };

    return {
      current: {
        temp: data.current.temperature_2m,
        feelsLike: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        windDirection: getWindDirection(data.current.wind_direction_10m),
        windGust: data.current.wind_gusts_10m,
        precipitation: data.current.precipitation,
        cloudCover: data.current.cloud_cover,
        pressure: data.current.surface_pressure,
        visibility: data.current.visibility,
        uvIndex: data.current.uv_index,
        isDay: data.current.is_day,
        description: getWeatherDescription(data.current.weather_code),
        icon: `${data.current.weather_code}`,
      },
      daily: data.daily.time.map((time: string, index: number) => ({
        dt: new Date(time).getTime() / 1000,
        sunrise: new Date(data.daily.sunrise[index]).getTime() / 1000,
        sunset: new Date(data.daily.sunset[index]).getTime() / 1000,
        temp: {
          min: data.daily.temperature_2m_min[index],
          max: data.daily.temperature_2m_max[index],
        },
        feelsLike: {
          min: data.daily.apparent_temperature_min[index],
          max: data.daily.apparent_temperature_max[index],
        },
        precipitation: data.daily.precipitation_sum[index],
        precipitationHours: data.daily.precipitation_hours[index],
        precipitationProbability: data.daily.precipitation_probability_mean[index],
        windSpeed: data.daily.wind_speed_10m_max[index],
        windGust: data.daily.wind_gusts_10m_max[index],
        windDirection: getWindDirection(data.daily.wind_direction_10m_dominant[index]),
        uvIndex: data.daily.uv_index_max[index],
        weather: [{
          description: getWeatherDescription(data.daily.weather_code[index]),
          icon: `${data.daily.weather_code[index]}`,
        }],
      })),
      alerts: [],
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

export async function searchLocations(query: string) {
  try {
    const response = await fetch(
      `${GEO_BASE_URL}/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }

    const data = await response.json();
    return data.results?.map((location: any) => ({
      lat: location.latitude,
      lon: location.longitude,
      name: location.name,
      country: location.country,
    })) || [];
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
}