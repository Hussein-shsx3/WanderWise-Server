"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateRegister = void 0;
const errorMiddleware_1 = require("./errorMiddleware");
const validateRegister = (req, res, next) => {
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
            if (!firstName)
                missing.push("firstName");
            if (!lastName)
                missing.push("lastName");
            if (!email)
                missing.push("email");
            if (!password)
                missing.push("password");
            throw new errorMiddleware_1.AppError(`Missing required fields: ${missing.join(", ")}`, 400, "MISSING_FIELDS");
        }
        // Convert to strings if needed
        const firstNameStr = String(firstName).trim();
        const lastNameStr = String(lastName).trim();
        const emailStr = String(email).trim().toLowerCase();
        const passwordStr = String(password);
        // Validate firstName
        if (firstNameStr.length < 2) {
            throw new errorMiddleware_1.AppError("First name must be at least 2 characters", 400, "INVALID_FIRST_NAME");
        }
        // Validate lastName
        if (lastNameStr.length < 2) {
            throw new errorMiddleware_1.AppError("Last name must be at least 2 characters", 400, "INVALID_LAST_NAME");
        }
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailStr)) {
            throw new errorMiddleware_1.AppError("Invalid email format", 400, "INVALID_EMAIL");
        }
        // Validate password
        if (passwordStr.length < 6) {
            throw new errorMiddleware_1.AppError("Password must be at least 6 characters", 400, "INVALID_PASSWORD");
        }
        console.log("Register validation passed");
        next();
    }
    catch (error) {
        if (error instanceof errorMiddleware_1.AppError) {
            next(error);
        }
        else {
            next(new errorMiddleware_1.AppError(error instanceof Error ? error.message : "Validation error", 400, "VALIDATION_ERROR"));
        }
    }
};
exports.validateRegister = validateRegister;
const validateLogin = (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new errorMiddleware_1.AppError("Email and password are required", 400, "MISSING_FIELDS");
        }
        const emailStr = String(email).trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailStr)) {
            throw new errorMiddleware_1.AppError("Invalid email format", 400, "INVALID_EMAIL");
        }
        if (String(password).length < 6) {
            throw new errorMiddleware_1.AppError("Password must be at least 6 characters", 400, "INVALID_PASSWORD");
        }
        next();
    }
    catch (error) {
        if (error instanceof errorMiddleware_1.AppError) {
            next(error);
        }
        else {
            next(new errorMiddleware_1.AppError(error instanceof Error ? error.message : "Validation error", 400, "VALIDATION_ERROR"));
        }
    }
};
exports.validateLogin = validateLogin;
