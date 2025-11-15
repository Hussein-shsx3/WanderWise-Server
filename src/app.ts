import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { errorHandler, notFound } from "./middleware/errorMiddleware";

const app: Application = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(",") || "*",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per windowMs
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Body Parser Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie Parser
app.use(cookieParser());

// Compression Middleware
app.use(compression());

// Logger Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Health Check Route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API Info Route
app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api",
    },
  });
});

// API Routes
// TODO: Import and use your routes here
// Example:
// import authRoutes from "./routes/authRoutes";
// import userRoutes from "./routes/userRoutes";
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);

// 404 Handler - Must be after all routes
app.use(notFound);

// Global Error Handler - Must be last
app.use(errorHandler);

export default app;
