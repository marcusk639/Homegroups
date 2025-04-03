import {Request, Response, NextFunction} from 'express';
import * as announcementService from '../services/announcement-service';
import {AuthRequest} from '../types/auth';
import {SUCCESS_MESSAGES} from '../utils/constants';

/**
 * Get all announcements for a group
 */
export const getGroupAnnouncements = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {id} = req.params; // Group ID
    const {limit, startAfter} = req.query;
    const userId = req.user?.uid as string;

    const limitNum = limit ? parseInt(limit as string) : 20;
    const announcements = await announcementService.getGroupAnnouncements(
      userId,
      id,
      limitNum,
      startAfter as string,
    );

    res.json(announcements);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single announcement by ID
 */
export const getAnnouncementById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {id, announcementId} = req.params;
    const userId = req.user?.uid as string;

    const announcement = await announcementService.getAnnouncementById(
      userId,
      id,
      announcementId,
    );

    res.json(announcement);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new announcement
 */
export const createAnnouncement = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {id} = req.params; // Group ID
    const userId = req.user?.uid as string;
    const announcementData = req.body;

    const announcement = await announcementService.createAnnouncement(
      userId,
      id,
      announcementData,
    );

    res.status(201).json({
      message: SUCCESS_MESSAGES.ANNOUNCEMENT_CREATED,
      announcement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an announcement
 */
export const updateAnnouncement = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {id, announcementId} = req.params;
    const userId = req.user?.uid as string;
    const updateData = req.body;

    const announcement = await announcementService.updateAnnouncement(
      userId,
      id,
      announcementId,
      updateData,
    );

    res.json({
      message: SUCCESS_MESSAGES.ANNOUNCEMENT_UPDATED,
      announcement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an announcement
 */
export const deleteAnnouncement = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {id, announcementId} = req.params;
    const userId = req.user?.uid as string;

    await announcementService.deleteAnnouncement(userId, id, announcementId);

    res.json({
      message: SUCCESS_MESSAGES.ANNOUNCEMENT_DELETED,
    });
  } catch (error) {
    next(error);
  }
};

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
