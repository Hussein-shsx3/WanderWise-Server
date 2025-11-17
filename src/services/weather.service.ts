import axios from "axios";
import { AppError } from "../middleware/errorMiddleware";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org";

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

/**
 * Get current weather for a location
 */
export const getCurrentWeather = async (
  latitude: number,
  longitude: number
): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/data/2.5/weather`, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: OPENWEATHER_API_KEY,
        units: "metric",
      },
    });

    const { main, weather, wind } = response.data;

    return {
      temp: Math.round(main.temp),
      condition: weather[0].main,
      humidity: main.humidity,
      windSpeed: Math.round(wind.speed * 10) / 10,
      icon: weather[0].icon,
    };
  } catch (error) {
    console.error("Weather API Error:", error);
    throw new AppError(
      "Failed to fetch weather data",
      500,
      "WEATHER_API_ERROR"
    );
  }
};

/**
 * Get weather forecast for multiple days
 */
export const getWeatherForecast = async (
  latitude: number,
  longitude: number,
  days: number
): Promise<WeatherData[]> => {
  try {
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/data/2.5/forecast`, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: OPENWEATHER_API_KEY,
        units: "metric",
        cnt: Math.min(days * 8, 40), // API returns data in 3-hour intervals
      },
    });

    const weatherByDay: { [key: string]: WeatherData[] } = {};

    response.data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!weatherByDay[date]) {
        weatherByDay[date] = [];
      }

      weatherByDay[date].push({
        temp: Math.round(item.main.temp),
        condition: item.weather[0].main,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 10) / 10,
        icon: item.weather[0].icon,
      });
    });

    // Return average weather for each day
    return Object.values(weatherByDay).map((dayWeather) => {
      const avgTemp =
        Math.round(dayWeather.reduce((sum, w) => sum + w.temp, 0) / dayWeather.length);
      const avgHumidity =
        Math.round(dayWeather.reduce((sum, w) => sum + w.humidity, 0) / dayWeather.length);
      const mostCommonCondition = dayWeather.reduce((acc, w) => {
        acc[w.condition] = (acc[w.condition] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const condition = Object.keys(mostCommonCondition).sort(
        (a, b) => mostCommonCondition[b] - mostCommonCondition[a]
      )[0];

      return {
        temp: avgTemp,
        condition,
        humidity: avgHumidity,
        windSpeed: dayWeather[0].windSpeed,
        icon: dayWeather[0].icon,
      };
    });
  } catch (error) {
    console.error("Weather Forecast API Error:", error);
    throw new AppError(
      "Failed to fetch weather forecast",
      500,
      "WEATHER_API_ERROR"
    );
  }
};

/**
 * Get geocoding data for a destination (get coordinates from name)
 */
export const getCoordinatesByDestination = async (
  destination: string
): Promise<{ latitude: number; longitude: number; displayName: string }> => {
  try {
    const response = await axios.get(
      `${OPENWEATHER_BASE_URL}/geo/1.0/direct`,
      {
        params: {
          q: destination,
          limit: 1,
          appid: OPENWEATHER_API_KEY,
        },
      }
    );

    if (!response.data || response.data.length === 0) {
      throw new AppError(
        "Destination not found",
        404,
        "DESTINATION_NOT_FOUND"
      );
    }

    const { lat, lon, name, country } = response.data[0];

    return {
      latitude: lat,
      longitude: lon,
      displayName: `${name}, ${country}`,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Geocoding API Error:", error);
    throw new AppError(
      "Failed to get destination coordinates",
      500,
      "GEOCODING_ERROR"
    );
  }
};
