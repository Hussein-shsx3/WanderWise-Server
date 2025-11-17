import { Router } from "express";
import { getMe, deleteMe } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/me", authMiddleware, getMe);
router.delete("/me", authMiddleware, deleteMe);

export default router;
