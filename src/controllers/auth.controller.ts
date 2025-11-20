// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorMiddleware";
import {
  registerUserService,
  loginUserService,
  forgotPasswordService,
  resetPasswordService,
} from "../services/auth.service";

import {
  RegisterDTO,
  LoginDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
} from "../dtos/auth.dto";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const data: RegisterDTO = req.body;
    const result = await registerUserService(data);
    res.status(201).json(result);
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const data: LoginDTO = req.body;
  const result = await loginUserService(data);
  res.status(200).json(result);
});

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const data: ForgotPasswordDTO = req.body;
    const result = await forgotPasswordService(data);
    res.status(200).json(result);
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const data: ResetPasswordDTO = req.body;
    const result = await resetPasswordService(data);
    res.status(200).json(result);
  }
);
