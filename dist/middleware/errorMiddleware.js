"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = exports.notFound = exports.AppError = void 0;
const chalk_1 = __importDefault(require("chalk"));
class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const notFound = (req, res, next) => {
    next(new AppError(`Not Found - ${req.originalUrl}`, 404, "NOT_FOUND"));
};
exports.notFound = notFound;
// Handle specific error types
const handleMongooseError = (err) => {
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field";
        const value = err.keyValue?.[field];
        return new AppError(`${field} '${value}' already exists`, 400, "DUPLICATE_KEY");
    }
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors)
            .map((e) => e.message)
            .join(", ");
        return new AppError(messages, 400, "VALIDATION_ERROR");
    }
    if (err.name === "CastError") {
        return new AppError(`Invalid ${err.path}: ${err.value}`, 400, "INVALID_ID");
    }
    return err;
};
const handleJWTError = (err) => {
    if (err.name === "JsonWebTokenError") {
        return new AppError("Invalid token. Please login again", 401, "JWT_INVALID");
    }
    if (err.name === "TokenExpiredError") {
        return new AppError("Token expired. Please login again", 401, "JWT_EXPIRED");
    }
    return err;
};
const errorHandler = (err, req, res, next) => {
    let error;
    if (err instanceof AppError) {
        error = err;
    }
    else if (err instanceof Error) {
        error = new AppError(err.message, 500, "INTERNAL_ERROR");
    }
    else {
        error = new AppError("Unknown error", 500, "UNKNOWN_ERROR");
    }
    // Enhance with specific handlers
    error = handleMongooseError(error);
    error = handleJWTError(error);
    // Handle JSON syntax errors
    if (err instanceof SyntaxError && "body" in err) {
        error = new AppError("Invalid JSON format", 400, "SYNTAX_ERROR");
    }
    // Handle Prisma errors
    if (err.code === "P2002") {
        const field = err.meta?.target?.[0] || "field";
        error = new AppError(`${field} already exists`, 400, "DUPLICATE_FIELD");
    }
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    const code = error.code || "INTERNAL_ERROR";
    // Logging
    if (process.env.NODE_ENV === "development") {
        console.error(chalk_1.default.red("Error:"), err);
    }
    else {
        console.error(chalk_1.default.red(`${err instanceof Error ? err.name : "Error"}: ${message}`));
    }
    res.status(statusCode).json({
        success: false,
        error: {
            message,
            code,
            ...(process.env.NODE_ENV === "development" && {
                stack: err.stack,
                details: err,
            }),
        },
    });
};
exports.errorHandler = errorHandler;
// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
