import { Schema, model, Document } from "mongoose";
import { IItinerary } from "../types/itinerary.type";

export interface IItineraryDocument extends IItinerary, Document {}

const activitySchema = new Schema(
  {
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
  },
  { _id: false }
);

const dayItinerarySchema = new Schema(
  {
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
  },
  { _id: false }
);

const itinerarySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

// Index for faster queries
itinerarySchema.index({ userId: 1, createdAt: -1 });
itinerarySchema.index({ destination: 1 });

export const Itinerary = model<IItineraryDocument>(
  "Itinerary",
  itinerarySchema
);
