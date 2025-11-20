"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const chalk_1 = __importDefault(require("chalk"));
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const mongoose_1 = __importDefault(require("mongoose"));
// Validate required environment variables
const requiredEnv = ["MONGODB_URI"];
requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        console.error(chalk_1.default.red(`Missing required env variable: ${key}`));
        process.exit(1);
    }
});
const PORT = process.env.PORT || 5000;
let server;
// Start server
const startServer = async () => {
    try {
        await (0, db_1.connectDB)();
        console.log(chalk_1.default.green("Database connected"));
        server = app_1.default.listen(PORT, () => {
            console.log(chalk_1.default.green(`Server running at http://localhost:${PORT}`));
        });
    }
    catch (error) {
        console.error(chalk_1.default.red(`Failed to start server: ${error.message}`));
        process.exit(1);
    }
};
// Graceful shutdown
const gracefulShutdown = async (signal) => {
    console.log(chalk_1.default.yellow(`${signal} received. Shutting down gracefully...`));
    if (server) {
        server.close(async () => {
            console.log(chalk_1.default.blue("HTTP server closed"));
            await (0, db_1.disconnectDB)();
            console.log(chalk_1.default.magenta("Database disconnected"));
            console.log(chalk_1.default.cyan("Shutdown complete"));
            process.exit(0);
        });
    }
    else {
        await (0, db_1.disconnectDB)();
        console.log(chalk_1.default.magenta("Database disconnected (no active server)"));
        console.log(chalk_1.default.cyan("Shutdown complete"));
        process.exit(0);
    }
};
// Handle process signals
["SIGTERM", "SIGINT"].forEach((sig) => process.on(sig, () => gracefulShutdown(sig)));
// Handle unhandled errors
process.on("unhandledRejection", (reason) => {
    console.error(chalk_1.default.red("Unhandled Rejection:"), reason);
    gracefulShutdown("Unhandled Rejection");
});
process.on("uncaughtException", (error) => {
    console.error(chalk_1.default.red("Uncaught Exception:"), error);
    process.exit(1);
});
// If MongoDB disconnects or encounters an error after startup, shut down the server
mongoose_1.default.connection.on("disconnected", () => {
    console.error(chalk_1.default.red("Mongoose disconnected from database — shutting down server."));
    setImmediate(() => gracefulShutdown("DB Disconnected"));
});
mongoose_1.default.connection.on("error", (err) => {
    console.error(chalk_1.default.red(`Mongoose connection error: ${err.message}`));
    setImmediate(() => gracefulShutdown("DB Error"));
});
// Start the application
startServer();
