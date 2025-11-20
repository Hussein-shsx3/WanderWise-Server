import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorMiddleware";

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { firstName, lastName, email, password } = req.body;

    console.log("Register validation - Received body:", {
      firstName,
      lastName,
      email,
      passwordLength: password?.length,
    });

    // Check if all required fields exist
    if (!firstName || !lastName || !email || !password) {
      const missing = [];
      if (!firstName) missing.push("firstName");
      if (!lastName) missing.push("lastName");
      if (!email) missing.push("email");
      if (!password) missing.push("password");

      throw new AppError(
        `Missing required fields: ${missing.join(", ")}`,
        400,
        "MISSING_FIELDS"
      );
    }

    // Convert to strings if needed
    const firstNameStr = String(firstName).trim();
    const lastNameStr = String(lastName).trim();
    const emailStr = String(email).trim().toLowerCase();
    const passwordStr = String(password);

    // Validate firstName
    if (firstNameStr.length < 2) {
      throw new AppError(
        "First name must be at least 2 characters",
        400,
        "INVALID_FIRST_NAME"
      );
    }

    // Validate lastName
    if (lastNameStr.length < 2) {
      throw new AppError(
        "Last name must be at least 2 characters",
        400,
        "INVALID_LAST_NAME"
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailStr)) {
      throw new AppError("Invalid email format", 400, "INVALID_EMAIL");
    }

    // Validate password
    if (passwordStr.length < 6) {
      throw new AppError(
        "Password must be at least 6 characters",
        400,
        "INVALID_PASSWORD"
      );
    }

    console.log("Register validation passed");
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(
        new AppError(
          error instanceof Error ? error.message : "Validation error",
          400,
          "VALIDATION_ERROR"
        )
      );
    }
  }
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(
        "Email and password are required",
        400,
        "MISSING_FIELDS"
      );
    }

    const emailStr = String(email).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailStr)) {
      throw new AppError("Invalid email format", 400, "INVALID_EMAIL");
    }

    if (String(password).length < 6) {
      throw new AppError(
        "Password must be at least 6 characters",
        400,
        "INVALID_PASSWORD"
      );
    }

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(
        new AppError(
          error instanceof Error ? error.message : "Validation error",
          400,
          "VALIDATION_ERROR"
        )
      );
    }
  }
};
