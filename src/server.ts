import * as dotenv from "dotenv";
import app from "./app";
import { connectDB, disconnectDB } from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 5000;

let server: any;

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDB();

    // Start Express server
    server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error: any) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n ${signal} received. Shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      console.log("🔒 HTTP server closed");
      await disconnectDB();
      process.exit(0);
    });
  }
};

// Handle process signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle unhandled errors
process.on("unhandledRejection", (reason: any) => {
  console.error("Unhandled Rejection:", reason);
  gracefulShutdown("Unhandled Rejection");
});

process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Start the application
startServer();
