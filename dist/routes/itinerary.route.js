"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const itinerary_controller_1 = require("../controllers/itinerary.controller");
const router = (0, express_1.Router)();
// Apply auth middleware to all routes
router.use(authMiddleware_1.authMiddleware);
// Itinerary CRUD routes
/**
 * POST /api/v1/itineraries - Create a new itinerary
 * POST /api/v1/itineraries/generate - Generate AI-powered itinerary
 * GET /api/v1/itineraries - Get all user's itineraries
 * GET /api/v1/itineraries/:id - Get specific itinerary
 * PUT /api/v1/itineraries/:id - Update itinerary
 * DELETE /api/v1/itineraries/:id - Delete itinerary
 */
// Generate must come before :id to avoid matching :id as 'generate'
router.post("/generate", itinerary_controller_1.generateAIItinerary);
router.post("/", itinerary_controller_1.createItinerary);
router.get("/", itinerary_controller_1.getUserItineraries);
router.get("/:id", itinerary_controller_1.getItinerary);
router.put("/:id", itinerary_controller_1.updateItinerary);
router.delete("/:id", itinerary_controller_1.deleteItinerary);
// Activity routes within a day
/**
 * POST /api/v1/itineraries/:id/days/:dayNumber/activities - Add activity
 * PUT /api/v1/itineraries/:id/days/:dayNumber/activities/:activityId - Update activity
 * DELETE /api/v1/itineraries/:id/days/:dayNumber/activities/:activityId - Delete activity
 */
router.post("/:id/days/:dayNumber/activities", itinerary_controller_1.addActivity);
router.put("/:id/days/:dayNumber/activities/:activityId", itinerary_controller_1.updateActivity);
router.delete("/:id/days/:dayNumber/activities/:activityId", itinerary_controller_1.deleteActivity);
exports.default = router;
