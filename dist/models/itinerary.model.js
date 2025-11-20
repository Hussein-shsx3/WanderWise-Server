"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Itinerary = void 0;
const mongoose_1 = require("mongoose");
const activitySchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: Number, required: true },
    location: {
        name: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    category: {
        type: String,
        enum: ["attraction", "dining", "accommodation", "transport", "shopping", "activity"],
        required: true,
    },
    estimatedCost: { type: Number },
    notes: { type: String },
}, { _id: false });
const dayItinerarySchema = new mongoose_1.Schema({
    day: { type: Number, required: true },
    date: { type: Date, required: true },
    weather: {
        temp: { type: Number },
        condition: { type: String },
        humidity: { type: Number },
        windSpeed: { type: Number },
        icon: { type: String },
    },
    activities: [activitySchema],
    summary: { type: String },
}, { _id: false });
const itinerarySchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    destination: { type: String, required: true, trim: true },
    coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    dayItineraries: [dayItinerarySchema],
    budget: { type: Number },
    travelStyle: {
        type: String,
        enum: ["budget", "comfort", "luxury"],
        default: "comfort",
    },
    preferences: [String],
    aiGenerated: { type: Boolean, default: false },
    aiNotes: { type: String },
}, { timestamps: true });
// Index for faster queries
itinerarySchema.index({ userId: 1, createdAt: -1 });
itinerarySchema.index({ destination: 1 });
exports.Itinerary = (0, mongoose_1.model)("Itinerary", itinerarySchema);
