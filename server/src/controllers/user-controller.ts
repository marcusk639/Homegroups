import {Response} from 'express';
import {ApiError} from '../middleware/error';
import {STATUS_CODES, ERROR_MESSAGES} from '../utils/constants';
import * as userService from '../services/user-service';
import * as authService from '../services/auth-service';
import {asyncHandler} from '../middleware/error';
import {AuthRequest} from '../types/auth';

/**
 * Get user profile
 */
export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.uid;
    if (!userId) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED,
      );
    }
    const profile = await userService.getUserProfile(userId);
    res.status(STATUS_CODES.OK).json(profile);
  },
);

/**
 * Update user profile
 */
export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.uid;
    if (!userId) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED,
      );
    }
    const profileData = req.body;
    const updatedProfile = await userService.updateUserProfile(
      userId,
      profileData,
    );
    res.status(STATUS_CODES.OK).json(updatedProfile);
  },
);

/**
 * Delete user account
 */
export const deleteAccount = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.uid;
    if (!userId) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED,
      );
    }
    await authService.deleteUser(userId);
    res.status(STATUS_CODES.NO_CONTENT).send();
  },
);
