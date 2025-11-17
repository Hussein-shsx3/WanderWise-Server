import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createItinerary,
  generateAIItinerary,
  getUserItineraries,
  getItinerary,
  updateItinerary,
  addActivity,
  updateActivity,
  deleteActivity,
  deleteItinerary,
} from "../controllers/itinerary.controller";

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

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
router.post("/generate", generateAIItinerary);

router.post("/", createItinerary);
router.get("/", getUserItineraries);
router.get("/:id", getItinerary);
router.put("/:id", updateItinerary);
router.delete("/:id", deleteItinerary);

// Activity routes within a day
/**
 * POST /api/v1/itineraries/:id/days/:dayNumber/activities - Add activity
 * PUT /api/v1/itineraries/:id/days/:dayNumber/activities/:activityId - Update activity
 * DELETE /api/v1/itineraries/:id/days/:dayNumber/activities/:activityId - Delete activity
 */

router.post("/:id/days/:dayNumber/activities", addActivity);
router.put("/:id/days/:dayNumber/activities/:activityId", updateActivity);
router.delete("/:id/days/:dayNumber/activities/:activityId", deleteActivity);

export default router;
