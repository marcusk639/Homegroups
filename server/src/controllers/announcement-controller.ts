import {Request, Response, NextFunction} from 'express';
import * as announcementService from '../services/announcement-service';
import {AuthRequest} from '../types/auth';
import {SUCCESS_MESSAGES} from '../utils/constants';
import {ApiError} from '../middleware/error';
import {STATUS_CODES, ERROR_MESSAGES} from '../utils/constants';
import {
  AnnouncementCreationData,
  AnnouncementUpdateData,
  AnnouncementPaginationData,
  AnnouncementAuthorData,
} from '../types/announcement';
import {asyncHandler} from '../middleware/error';

/**
 * Get all announcements for a group
 */
export const getGroupAnnouncements = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.uid;
    if (!userId) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED,
      );
    }
    const {groupId} = req.params;
    const {limit, startAfter} = req.query;
    const paginationData: AnnouncementPaginationData = {
      limit: limit ? parseInt(limit as string) : 20,
      startAfter: startAfter as string | undefined,
    };
    const announcements = await announcementService.getGroupAnnouncements(
      userId,
      groupId,
      paginationData.limit,
      paginationData.startAfter,
    );
    res.status(STATUS_CODES.OK).json(announcements);
  },
);

/**
 * Get a single announcement by ID
 */
export const getAnnouncementById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.uid;
    if (!userId) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED,
      );
    }
    const {groupId, announcementId} = req.params;
    const announcement = await announcementService.getAnnouncementById(
      userId,
      groupId,
      announcementId,
    );
    res.status(STATUS_CODES.OK).json(announcement);
  },
);

/**
 * Create a new announcement
 */
export const createAnnouncement = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.uid;
    if (!userId) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED,
      );
    }
    const {groupId} = req.params;
    const announcementData = req.body as AnnouncementCreationData;
    const announcement = await announcementService.createAnnouncement(
      userId,
      groupId,
      announcementData,
    );
    res.status(STATUS_CODES.CREATED).json(announcement);
  },
);

/**
 * Update an announcement
 */
export const updateAnnouncement = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.uid;
    if (!userId) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED,
      );
    }
    const {groupId, announcementId} = req.params;
    const announcementData = req.body as AnnouncementUpdateData;
    const announcement = await announcementService.updateAnnouncement(
      userId,
      groupId,
      announcementId,
      announcementData,
    );
    res.status(STATUS_CODES.OK).json(announcement);
  },
);

/**
 * Delete an announcement
 */
export const deleteAnnouncement = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.uid;
    if (!userId) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED,
      );
    }
    const {groupId, announcementId} = req.params;
    await announcementService.deleteAnnouncement(
      userId,
      groupId,
      announcementId,
    );
    res.status(STATUS_CODES.NO_CONTENT).send();
  },
);

/**
 * Clean up expired announcements
 */
export const cleanupExpiredAnnouncements = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {id} = req.params; // Group ID
    const userId = req.user?.uid as string;

    // Verify the user is a member of the group (this will throw if not)
    await announcementService.getGroupAnnouncements(userId, id, 1);

    const result = await announcementService.cleanupExpiredAnnouncements(id);

    res.json({
      message: `Successfully cleaned up ${result.count} expired announcements`,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
