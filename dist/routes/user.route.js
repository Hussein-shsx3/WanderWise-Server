"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/me", authMiddleware_1.authMiddleware, user_controller_1.getMe);
router.delete("/me", authMiddleware_1.authMiddleware, user_controller_1.deleteMe);
exports.default = router;
