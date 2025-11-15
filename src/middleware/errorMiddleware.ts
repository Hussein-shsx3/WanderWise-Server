import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError(
    `Not Found - ${req.originalUrl}`,
    404,
    "NOT_FOUND"
  );
  next(error);
};

// Handle specific error types
const handleMongooseError = (err: any): AppError => {
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const value = err.keyValue?.[field];
    return new AppError(
      `${field} '${value}' already exists`,
      400,
      "DUPLICATE_KEY"
    );
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors)
      .map((e: any) => e.message)
      .join(", ");
    return new AppError(messages, 400, "VALIDATION_ERROR");
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 400, "INVALID_ID");
  }

  return err;
};

const handleJWTError = (err: any): AppError => {
  if (err.name === "JsonWebTokenError") {
    return new AppError(
      "Invalid token. Please login again",
      401,
      "JWT_INVALID"
    );
  }
  if (err.name === "TokenExpiredError") {
    return new AppError(
      "Token expired. Please login again",
      401,
      "JWT_EXPIRED"
    );
  }
  return err;
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", err);
  } else {
    console.error(`❌ ${err.name}: ${err.message}`);
  }

  // Handle Mongoose errors
  error = handleMongooseError(error);

  // Handle JWT errors
  error = handleJWTError(error);

  // Handle JSON syntax errors
  if (err instanceof SyntaxError && "body" in err) {
    error = new AppError("Invalid JSON format", 400, "SYNTAX_ERROR");
  }

  // Handle Prisma errors (if you switch to Prisma later)
  if (err.code === "P2002") {
    const field = err.meta?.target?.[0] || "field";
    error = new AppError(`${field} already exists`, 400, "DUPLICATE_FIELD");
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  const code = error.code || "INTERNAL_ERROR";

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

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
