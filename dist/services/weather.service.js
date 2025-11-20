"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoordinatesByDestination = exports.getWeatherForecast = exports.getCurrentWeather = void 0;
const axios_1 = __importDefault(require("axios"));
const errorMiddleware_1 = require("../middleware/errorMiddleware");
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org";
/**
 * Get current weather for a location
 */
const getCurrentWeather = async (latitude, longitude) => {
    try {
        const response = await axios_1.default.get(`${OPENWEATHER_BASE_URL}/data/2.5/weather`, {
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
    }
    catch (error) {
        console.error("Weather API Error:", error);
        throw new errorMiddleware_1.AppError("Failed to fetch weather data", 500, "WEATHER_API_ERROR");
    }
};
exports.getCurrentWeather = getCurrentWeather;
/**
 * Get weather forecast for multiple days
 */
const getWeatherForecast = async (latitude, longitude, days) => {
    try {
        const response = await axios_1.default.get(`${OPENWEATHER_BASE_URL}/data/2.5/forecast`, {
            params: {
                lat: latitude,
                lon: longitude,
                appid: OPENWEATHER_API_KEY,
                units: "metric",
                cnt: Math.min(days * 8, 40), // API returns data in 3-hour intervals
            },
        });
        const weatherByDay = {};
        response.data.list.forEach((item) => {
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
            const avgTemp = Math.round(dayWeather.reduce((sum, w) => sum + w.temp, 0) / dayWeather.length);
            const avgHumidity = Math.round(dayWeather.reduce((sum, w) => sum + w.humidity, 0) / dayWeather.length);
            const mostCommonCondition = dayWeather.reduce((acc, w) => {
                acc[w.condition] = (acc[w.condition] || 0) + 1;
                return acc;
            }, {});
            const condition = Object.keys(mostCommonCondition).sort((a, b) => mostCommonCondition[b] - mostCommonCondition[a])[0];
            return {
                temp: avgTemp,
                condition,
                humidity: avgHumidity,
                windSpeed: dayWeather[0].windSpeed,
                icon: dayWeather[0].icon,
            };
        });
    }
    catch (error) {
        console.error("Weather Forecast API Error:", error);
        throw new errorMiddleware_1.AppError("Failed to fetch weather forecast", 500, "WEATHER_API_ERROR");
    }
};
exports.getWeatherForecast = getWeatherForecast;
/**
 * Get geocoding data for a destination (get coordinates from name)
 */
const getCoordinatesByDestination = async (destination) => {
    try {
        const response = await axios_1.default.get(`${OPENWEATHER_BASE_URL}/geo/1.0/direct`, {
            params: {
                q: destination,
                limit: 1,
                appid: OPENWEATHER_API_KEY,
            },
        });
        if (!response.data || response.data.length === 0) {
            throw new errorMiddleware_1.AppError("Destination not found", 404, "DESTINATION_NOT_FOUND");
        }
        const { lat, lon, name, country } = response.data[0];
        return {
            latitude: lat,
            longitude: lon,
            displayName: `${name}, ${country}`,
        };
    }
    catch (error) {
        if (error instanceof errorMiddleware_1.AppError)
            throw error;
        console.error("Geocoding API Error:", error);
        throw new errorMiddleware_1.AppError("Failed to get destination coordinates", 500, "GEOCODING_ERROR");
    }
};
exports.getCoordinatesByDestination = getCoordinatesByDestination;
