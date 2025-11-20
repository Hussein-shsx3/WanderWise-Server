"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateToken = (length = 32, expireHours = 24) => {
    const token = crypto_1.default.randomBytes(length).toString("hex");
    const expires = new Date(Date.now() + expireHours * 60 * 60 * 1000); // now + 24h
    return { token, expires };
};
exports.generateToken = generateToken;
