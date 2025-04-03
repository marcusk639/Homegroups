import mongoose from "mongoose";
import logger from "../utils/logger";

/**
 * Connect to MongoDB database
 */
export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/recovery-connect"
    );

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Set up connection error handlers
    mongoose.connection.on("error", (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected");
    });

    // Handle process termination
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error connecting to MongoDB: ${error.message}`);
    } else {
      logger.error("Unknown error connecting to MongoDB");
    }
    process.exit(1);
  }
};

/**
 * Close the MongoDB connection
 */
export const closeDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error closing MongoDB connection: ${error.message}`);
    } else {
      logger.error("Unknown error closing MongoDB connection");
    }
  }
};

export default mongoose;
