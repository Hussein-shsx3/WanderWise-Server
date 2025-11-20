"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMe = exports.getMe = void 0;
const errorMiddleware_1 = require("../middleware/errorMiddleware");
const user_service_1 = require("../services/user.service");
exports.getMe = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    const result = await (0, user_service_1.getMeService)(userId);
    res.json(result);
});
exports.deleteMe = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    const result = await (0, user_service_1.deleteMeService)(userId);
    res.json(result);
});
