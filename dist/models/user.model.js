"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        minlength: [2, "First name must be at least 2 characters"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        minlength: [2, "Last name must be at least 2 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email",
        ],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
        minlength: [6, "Password must be at least 6 characters"],
    },
    avatar: {
        type: String,
        default: "",
    },
    resetPasswordToken: {
        type: String,
        default: null,
        select: false,
    },
    resetPasswordExpires: {
        type: Date,
        default: null,
        select: false,
    },
    verificationToken: {
        type: String,
        default: null,
        select: false,
    },
    verificationTokenExpires: {
        type: Date,
        default: null,
        select: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
        index: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Virtual for full name
userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});
// Hash password before saving
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password"))
            return next();
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcryptjs_1.default.compare(candidatePassword, this.password);
    }
    catch (error) {
        throw new Error("Password comparison failed");
    }
};
// Get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function () {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.resetPasswordToken;
    delete userObject.resetPasswordExpires;
    delete userObject.verificationToken;
    delete userObject.verificationTokenExpires;
    return userObject;
};
// Check if password reset token is expired
userSchema.methods.isPasswordExpired = function () {
    if (!this.resetPasswordExpires)
        return true;
    return new Date() > this.resetPasswordExpires;
};
// Check if verification token is expired
userSchema.methods.isVerificationTokenExpired = function () {
    if (!this.verificationTokenExpires)
        return true;
    return new Date() > this.verificationTokenExpires;
};
// Indexes for better query performance
userSchema.index({ createdAt: -1 });
exports.User = (0, mongoose_1.model)("User", userSchema);
