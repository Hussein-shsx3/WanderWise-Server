"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
// server/src/config/db.ts
const mongoose_1 = __importDefault(require("mongoose"));
const chalk_1 = __importDefault(require("chalk"));
mongoose_1.default.set("strictQuery", true);
const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error(chalk_1.default.red("Missing required env variable: MONGODB_URI"));
        process.exit(1);
    }
    try {
        const conn = await mongoose_1.default.connect(uri, {
            maxPoolSize: 10, // only valid option here
        });
        console.log(chalk_1.default.green(`MongoDB connected at host: ${conn.connection.host}`));
    }
    catch (err) {
        console.error(chalk_1.default.red(`MongoDB connection failed: ${err.message}`));
        throw err;
    }
};
exports.connectDB = connectDB;
// Mongo connection events
mongoose_1.default.connection.on("connected", () => {
    console.log(chalk_1.default.blue("Mongoose connected to database"));
});
mongoose_1.default.connection.on("error", (err) => {
    console.error(chalk_1.default.red(`Mongoose connection error: ${err.message}`));
});
mongoose_1.default.connection.on("disconnected", () => {
    console.log(chalk_1.default.yellow("Mongoose disconnected from database"));
});
// Graceful shutdown
const disconnectDB = async () => {
    try {
        await mongoose_1.default.connection.close();
        console.log(chalk_1.default.magenta("MongoDB connection closed"));
    }
    catch (err) {
        console.error(chalk_1.default.red(`Error closing MongoDB connection: ${err.message}`));
        throw err;
    }
};
exports.disconnectDB = disconnectDB;
