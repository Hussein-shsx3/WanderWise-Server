"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItineraryService = exports.deleteActivityService = exports.updateActivityService = exports.addActivityService = exports.updateItineraryService = exports.getItineraryService = exports.getUserItinerariesService = exports.generateAIItineraryService = exports.createItineraryService = void 0;
const itinerary_model_1 = require("../models/itinerary.model");
const errorMiddleware_1 = require("../middleware/errorMiddleware");
const ai_service_1 = require("./ai.service");
const weather_service_1 = require("./weather.service");
/**
 * Create a basic itinerary (user-created, not AI-generated)
 */
const createItineraryService = async (userId, data) => {
    const { destination, startDate, endDate, budget, travelStyle, preferences } = data;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
        throw new errorMiddleware_1.AppError("End date must be after start date", 400, "INVALID_DATE_RANGE");
    }
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    // Get coordinates for destination
    const { latitude, longitude } = await (0, weather_service_1.getCoordinatesByDestination)(destination);
    // Initialize empty day itineraries
    const dayItineraries = [];
    for (let i = 1; i <= duration; i++) {
        const dayDate = new Date(start);
        dayDate.setDate(dayDate.getDate() + i - 1);
        dayItineraries.push({
            day: i,
            date: dayDate,
            activities: [],
        });
    }
    const itinerary = await itinerary_model_1.Itinerary.create({
        userId,
        destination,
        coordinates: { latitude, longitude },
        startDate: start,
        endDate: end,
        duration,
        dayItineraries,
        budget,
        travelStyle: travelStyle || "comfort",
        preferences: preferences || [],
        aiGenerated: false,
    });
    return {
        success: true,
        message: "Itinerary created successfully",
        itinerary,
    };
};
exports.createItineraryService = createItineraryService;
/**
 * Generate AI-powered itinerary
 */
const generateAIItineraryService = async (userId, data) => {
    const { destination, startDate, endDate, budget, travelStyle, preferences } = data;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
        throw new errorMiddleware_1.AppError("End date must be after start date", 400, "INVALID_DATE_RANGE");
    }
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    // Get coordinates for destination
    const { latitude, longitude } = await (0, weather_service_1.getCoordinatesByDestination)(destination);
    // Get weather forecast
    const weatherForecast = await (0, weather_service_1.getWeatherForecast)(latitude, longitude, duration);
    // Generate itinerary with AI
    const aiResponse = await (0, ai_service_1.generateTravelItinerary)(destination, startDate, endDate, travelStyle || "comfort", budget, preferences, duration);
    // Initialize day itineraries with weather and AI-generated activities
    const dayItineraries = [];
    for (let i = 0; i < duration; i++) {
        const dayDate = new Date(start);
        dayDate.setDate(dayDate.getDate() + i);
        // Get AI activities for this day
        const dailyActivities = aiResponse.dayActivities[i] || [];
        dayItineraries.push({
            day: i + 1,
            date: dayDate,
            weather: weatherForecast[i] || {
                temp: 20,
                condition: "Clear",
                humidity: 50,
                windSpeed: 5,
                icon: "01d",
            },
            activities: dailyActivities,
            summary: dailyActivities.map((a) => a.name).join(" • ") || "",
        });
    }
    const itinerary = await itinerary_model_1.Itinerary.create({
        userId,
        destination,
        coordinates: { latitude, longitude },
        startDate: start,
        endDate: end,
        duration,
        dayItineraries,
        budget,
        travelStyle: travelStyle || "comfort",
        preferences: preferences || [],
        aiGenerated: true,
        aiNotes: aiResponse.summary || aiResponse.tips,
    });
    return {
        success: true,
        message: "AI itinerary generated successfully",
        itinerary,
        aiSuggestions: aiResponse.summary,
    };
};
exports.generateAIItineraryService = generateAIItineraryService;
/**
 * Get all itineraries for a user
 */
const getUserItinerariesService = async (userId) => {
    const itineraries = await itinerary_model_1.Itinerary.find({ userId }).sort({ createdAt: -1 });
    return {
        success: true,
        count: itineraries.length,
        itineraries,
    };
};
exports.getUserItinerariesService = getUserItinerariesService;
/**
 * Get a specific itinerary
 */
const getItineraryService = async (userId, itineraryId) => {
    const itinerary = await itinerary_model_1.Itinerary.findOne({
        _id: itineraryId,
        userId,
    });
    if (!itinerary) {
        throw new errorMiddleware_1.AppError("Itinerary not found", 404, "NOT_FOUND");
    }
    return {
        success: true,
        itinerary,
    };
};
exports.getItineraryService = getItineraryService;
/**
 * Update itinerary
 */
const updateItineraryService = async (userId, itineraryId, data) => {
    const itinerary = await itinerary_model_1.Itinerary.findOne({
        _id: itineraryId,
        userId,
    });
    if (!itinerary) {
        throw new errorMiddleware_1.AppError("Itinerary not found", 404, "NOT_FOUND");
    }
    // Handle date updates
    if (data.startDate || data.endDate) {
        const start = new Date(data.startDate || itinerary.startDate);
        const end = new Date(data.endDate || itinerary.endDate);
        if (start >= end) {
            throw new errorMiddleware_1.AppError("End date must be after start date", 400, "INVALID_DATE_RANGE");
        }
        itinerary.startDate = start;
        itinerary.endDate = end;
        itinerary.duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }
    // Update other fields
    if (data.destination)
        itinerary.destination = data.destination;
    if (data.budget !== undefined)
        itinerary.budget = data.budget;
    if (data.travelStyle)
        itinerary.travelStyle = data.travelStyle;
    if (data.preferences)
        itinerary.preferences = data.preferences;
    if (data.dayItineraries)
        itinerary.dayItineraries = data.dayItineraries;
    if (data.aiNotes)
        itinerary.aiNotes = data.aiNotes;
    await itinerary.save();
    return {
        success: true,
        message: "Itinerary updated successfully",
        itinerary,
    };
};
exports.updateItineraryService = updateItineraryService;
/**
 * Add activity to a day
 */
const addActivityService = async (userId, itineraryId, dayNumber, activity) => {
    const itinerary = await itinerary_model_1.Itinerary.findOne({
        _id: itineraryId,
        userId,
    });
    if (!itinerary) {
        throw new errorMiddleware_1.AppError("Itinerary not found", 404, "NOT_FOUND");
    }
    const dayItinerary = itinerary.dayItineraries.find((d) => d.day === dayNumber);
    if (!dayItinerary) {
        throw new errorMiddleware_1.AppError("Day not found in itinerary", 404, "DAY_NOT_FOUND");
    }
    dayItinerary.activities.push(activity);
    await itinerary.save();
    return {
        success: true,
        message: "Activity added successfully",
        itinerary,
    };
};
exports.addActivityService = addActivityService;
/**
 * Update activity in a day
 */
const updateActivityService = async (userId, itineraryId, dayNumber, activityId, updatedActivity) => {
    const itinerary = await itinerary_model_1.Itinerary.findOne({
        _id: itineraryId,
        userId,
    });
    if (!itinerary) {
        throw new errorMiddleware_1.AppError("Itinerary not found", 404, "NOT_FOUND");
    }
    const dayItinerary = itinerary.dayItineraries.find((d) => d.day === dayNumber);
    if (!dayItinerary) {
        throw new errorMiddleware_1.AppError("Day not found in itinerary", 404, "DAY_NOT_FOUND");
    }
    const activity = dayItinerary.activities.find((a) => a.id === activityId);
    if (!activity) {
        throw new errorMiddleware_1.AppError("Activity not found", 404, "ACTIVITY_NOT_FOUND");
    }
    Object.assign(activity, updatedActivity);
    await itinerary.save();
    return {
        success: true,
        message: "Activity updated successfully",
        itinerary,
    };
};
exports.updateActivityService = updateActivityService;
/**
 * Delete activity from a day
 */
const deleteActivityService = async (userId, itineraryId, dayNumber, activityId) => {
    const itinerary = await itinerary_model_1.Itinerary.findOne({
        _id: itineraryId,
        userId,
    });
    if (!itinerary) {
        throw new errorMiddleware_1.AppError("Itinerary not found", 404, "NOT_FOUND");
    }
    const dayItinerary = itinerary.dayItineraries.find((d) => d.day === dayNumber);
    if (!dayItinerary) {
        throw new errorMiddleware_1.AppError("Day not found in itinerary", 404, "DAY_NOT_FOUND");
    }
    const activityIndex = dayItinerary.activities.findIndex((a) => a.id === activityId);
    if (activityIndex === -1) {
        throw new errorMiddleware_1.AppError("Activity not found", 404, "ACTIVITY_NOT_FOUND");
    }
    dayItinerary.activities.splice(activityIndex, 1);
    await itinerary.save();
    return {
        success: true,
        message: "Activity deleted successfully",
        itinerary,
    };
};
exports.deleteActivityService = deleteActivityService;
/**
 * Delete itinerary
 */
const deleteItineraryService = async (userId, itineraryId) => {
    const result = await itinerary_model_1.Itinerary.findOneAndDelete({
        _id: itineraryId,
        userId,
    });
    if (!result) {
        throw new errorMiddleware_1.AppError("Itinerary not found", 404, "NOT_FOUND");
    }
    return {
        success: true,
        message: "Itinerary deleted successfully",
    };
};
exports.deleteItineraryService = deleteItineraryService;
