import { config } from "dotenv";
config(); // Load environment variables

import app from "./app";
// import { connectDB } from "./config/database";
import logger from "./utils/logger";

// Connect to MongoDB
// connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  logger.error(err.stack || "No stack trace available");

  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  logger.error(err.stack || "No stack trace available");

  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

export default server;
