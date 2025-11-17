// src/routes/auth.routes.ts
import { Router } from "express";
import {
  registerUser,
  loginUser,
  verifyUser,
  resendVerification,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
