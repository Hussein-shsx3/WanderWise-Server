"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItinerary = exports.deleteActivity = exports.updateActivity = exports.addActivity = exports.updateItinerary = exports.getItinerary = exports.getUserItineraries = exports.generateAIItinerary = exports.createItinerary = void 0;
const errorMiddleware_1 = require("../middleware/errorMiddleware");
const itinerary_service_1 = require("../services/itinerary.service");
/**
 * @desc Create a new itinerary
 * @route POST /api/v1/itineraries
 * @access Private
 */
exports.createItinerary = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    const data = req.body;
    const result = await (0, itinerary_service_1.createItineraryService)(userId, data);
    res.status(201).json(result);
});
/**
 * @desc Generate AI-powered itinerary
 * @route POST /api/v1/itineraries/generate
 * @access Private
 */
exports.generateAIItinerary = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    const data = req.body;
    const result = await (0, itinerary_service_1.generateAIItineraryService)(userId, data);
    res.status(201).json(result);
});
/**
 * @desc Get all itineraries for the user
 * @route GET /api/v1/itineraries
 * @access Private
 */
exports.getUserItineraries = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    const result = await (0, itinerary_service_1.getUserItinerariesService)(userId);
    res.status(200).json(result);
});
/**
 * @desc Get a specific itinerary
 * @route GET /api/v1/itineraries/:id
 * @access Private
 */
exports.getItinerary = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const result = await (0, itinerary_service_1.getItineraryService)(userId, id);
    res.status(200).json(result);
});
/**
 * @desc Update itinerary
 * @route PUT /api/v1/itineraries/:id
 * @access Private
 */
exports.updateItinerary = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const data = req.body;
    const result = await (0, itinerary_service_1.updateItineraryService)(userId, id, data);
    res.status(200).json(result);
});
/**
 * @desc Add activity to a day in itinerary
 * @route POST /api/v1/itineraries/:id/days/:dayNumber/activities
 * @access Private
 */
exports.addActivity = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    const { id, dayNumber } = req.params;
    const activity = req.body;
    const result = await (0, itinerary_service_1.addActivityService)(userId, id, parseInt(dayNumber), activity);
    res.status(201).json(result);
});
/**
 * @desc Update activity in a day
 * @route PUT /api/v1/itineraries/:id/days/:dayNumber/activities/:activityId
 * @access Private
 */
exports.updateActivity = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    const { id, dayNumber, activityId } = req.params;
    const updatedActivity = req.body;
    const result = await (0, itinerary_service_1.updateActivityService)(userId, id, parseInt(dayNumber), activityId, updatedActivity);
    res.status(200).json(result);
});
/**
 * @desc Delete activity from a day
 * @route DELETE /api/v1/itineraries/:id/days/:dayNumber/activities/:activityId
 * @access Private
 */
exports.deleteActivity = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    const { id, dayNumber, activityId } = req.params;
    const result = await (0, itinerary_service_1.deleteActivityService)(userId, id, parseInt(dayNumber), activityId);
    res.status(200).json(result);
});
/**
 * @desc Delete itinerary
 * @route DELETE /api/v1/itineraries/:id
 * @access Private
 */
exports.deleteItinerary = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const result = await (0, itinerary_service_1.deleteItineraryService)(userId, id);
    res.status(200).json(result);
});
