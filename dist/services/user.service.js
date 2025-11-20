"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMeService = exports.getMeService = void 0;
const user_model_1 = require("../models/user.model");
const errorMiddleware_1 = require("../middleware/errorMiddleware");
const getMeService = async (userId) => {
    const user = await user_model_1.User.findById(userId).select("-password");
    if (!user)
        throw new errorMiddleware_1.AppError("User not found", 404, "USER_NOT_FOUND");
    return {
        success: true,
        user,
    };
};
exports.getMeService = getMeService;
const deleteMeService = async (userId) => {
    const user = await user_model_1.User.findById(userId);
    if (!user)
        throw new errorMiddleware_1.AppError("User not found", 404, "USER_NOT_FOUND");
    await user_model_1.User.findByIdAndDelete(userId);
    return {
        success: true,
        message: "Account deleted successfully",
    };
};
exports.deleteMeService = deleteMeService;
