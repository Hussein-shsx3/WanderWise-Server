import { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorMiddleware";
import { getMeService, deleteMeService } from "../services/user.service";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await getMeService(userId!);
  res.json(result);
});

export const deleteMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await deleteMeService(userId!);
  res.json(result);
});
