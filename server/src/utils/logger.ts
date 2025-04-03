import winston from "winston";

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define level based on environment
const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";

  // Use specific log level from environment variable if set
  const logLevel = process.env.LOG_LEVEL?.toLowerCase();
  if (logLevel && Object.keys(levels).includes(logLevel)) {
    return logLevel;
  }

  return isDevelopment ? "debug" : "info";
};

// Define colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

// Add colors to winston
winston.addColors(colors);

// Define the format for console logs
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define the format for file logs (no colors)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.json()
);

// Define which transports to use
const transports = [
  // Console transport
  new winston.transports.Console({
    format: consoleFormat,
  }),

  // Error log file transport
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
    format: fileFormat,
  }),

  // Combined log file transport
  new winston.transports.File({
    filename: "logs/combined.log",
    format: fileFormat,
  }),
];

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
  // Don't exit on uncaught exceptions
  exitOnError: false,
});

export default logger;
