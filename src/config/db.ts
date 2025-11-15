import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      console.error(`Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected from DB");
    });
  } catch (error: any) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

// Graceful shutdown
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error: any) {
    console.error(`Error closing MongoDB connection: ${error.message}`);
    throw error;
  }
};
