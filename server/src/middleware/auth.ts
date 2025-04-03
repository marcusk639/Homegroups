import { Request, Response, NextFunction } from "express";
import { DecodedToken, AuthRequest } from "../types/auth";
import { verifyToken } from "../utils/helpers";
import { ApiError } from "./error";
import { STATUS_CODES, ERROR_MESSAGES } from "../utils/constants";
import { auth as firebaseAuth } from "../config/firebase";
import logger from "../utils/logger";

/**
 * Middleware to authenticate user via JWT token
 * Extracts token from the Authorization header and verifies it
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.TOKEN_REQUIRED
      );
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.TOKEN_REQUIRED
      );
    }

    // Verify the token
    const decoded = verifyToken(token);

    if (!decoded) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.INVALID_TOKEN
      );
    }

    // Verify user exists in Firebase
    try {
      await firebaseAuth.getUser(decoded.uid);
    } catch (error) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.USER_NOT_FOUND
      );
    }

    // Add user data to request
    (req as AuthRequest).user = decoded;

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else if (error instanceof Error) {
      logger.error(`Authentication error: ${error.message}`);
      next(
        new ApiError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED)
      );
    } else {
      next(
        new ApiError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED)
      );
    }
  }
};

/**
 * Middleware to check if the user is an admin
 * Must be used after the authenticate middleware
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const user = (req as AuthRequest).user;

    if (!user) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED
      );
    }

    if (user.role !== "admin") {
      throw new ApiError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if the user is a member of a group
 * Must be used after the authenticate middleware
 */
export const requireGroupMembership = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // This would be implemented in a real app with database queries
  // For now, we'll just pass through
  next();
};

/**
 * Middleware to check if the user is an admin of a group
 * Must be used after the authenticate middleware
 */
export const requireGroupAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // This would be implemented in a real app with database queries
  // For now, we'll just pass through
  next();
};
