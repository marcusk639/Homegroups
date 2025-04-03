import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../utils/constants";
import logger from "../utils/logger";

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default error values
  let statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let isOperational = false;
  let stack: string | undefined;

  // If this is our custom API error, use its properties
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
    stack = err.stack;
  } else if (err instanceof Error) {
    // For standard errors, use the message but keep default status code
    message = err.message;
    stack = err.stack;
  }

  // Log the error
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${message}`);
    logger.error(stack || "No stack trace available");
  } else {
    logger.warn(`${statusCode} - ${message}`);
  }

  // Build error response
  const errorResponse: any = {
    success: false,
    message,
  };

  // Include error details in development mode
  if (process.env.NODE_ENV === "development" && stack) {
    errorResponse.stack = stack;
    errorResponse.isOperational = isOperational;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

/**
 * Async error wrapper for controllers
 * This eliminates the need for try/catch blocks in controller functions
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * Not found error handler - used for routes that don't exist
 */
export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new ApiError(
    STATUS_CODES.NOT_FOUND,
    `Route not found - ${req.originalUrl}`
  );
  next(error);
};
