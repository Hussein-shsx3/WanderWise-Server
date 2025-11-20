import { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorMiddleware";
import {
  createItineraryService,
  generateAIItineraryService,
  getUserItinerariesService,
  getItineraryService,
  updateItineraryService,
  addActivityService,
  updateActivityService,
  deleteActivityService,
  deleteItineraryService,
} from "../services/itinerary.service";
import { CreateItineraryDTO, GenerateItineraryDTO } from "../dtos/itinerary.dto";
import { IActivity } from "../types/itinerary.type";

export const createItinerary = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const data: CreateItineraryDTO = req.body;

    const result = await createItineraryService(userId!, data);
    res.status(201).json(result);
  }
);

export const generateAIItinerary = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const data: GenerateItineraryDTO = req.body;

    const result = await generateAIItineraryService(userId!, data);
    res.status(201).json(result);
  }
);

export const getUserItineraries = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = await getUserItinerariesService(userId!);
    res.status(200).json(result);
  }
);

export const getItinerary = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await getItineraryService(userId!, id);
    res.status(200).json(result);
  }
);

export const updateItinerary = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const data = req.body;

    const result = await updateItineraryService(userId!, id, data);
    res.status(200).json(result);
  }
);

export const addActivity = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id, dayNumber } = req.params;
    const activity: IActivity = req.body;

    const result = await addActivityService(
      userId!,
      id,
      parseInt(dayNumber),
      activity
    );
    res.status(201).json(result);
  }
);

export const updateActivity = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id, dayNumber, activityId } = req.params;
    const updatedActivity = req.body;

    const result = await updateActivityService(
      userId!,
      id,
      parseInt(dayNumber),
      activityId,
      updatedActivity
    );
    res.status(200).json(result);
  }
);

export const deleteActivity = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id, dayNumber, activityId } = req.params;

    const result = await deleteActivityService(
      userId!,
      id,
      parseInt(dayNumber),
      activityId
    );
    res.status(200).json(result);
  }
);

export const deleteItinerary = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await deleteItineraryService(userId!, id);
    res.status(200).json(result);
  }
);
