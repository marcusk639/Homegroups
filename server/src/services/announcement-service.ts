import * as firestoreUtils from '../utils/firestore';
import {ApiError} from '../middleware/error';
import {STATUS_CODES, ERROR_MESSAGES} from '../utils/constants';
import logger from '../utils/logger';
import {
  Announcement,
  AnnouncementCreationData,
  AnnouncementUpdateData,
} from '../types/announcement';
import {getGroupById} from './group-service';
import {UserProfile} from '@/types';

/**
 * Get all announcements for a group
 */
export const getGroupAnnouncements = async (
  userId: string,
  groupId: string,
  limit: number = 20,
  startAfter?: string,
) => {
  try {
    // Verify the group exists and user is a member
    await getGroupById(userId, groupId);

    // Build the query
    let query = firestoreUtils
      .colRef<Announcement>(`groups/${groupId}/announcements`)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    // If starting after a specific document
    if (startAfter) {
      const startAfterDoc = await firestoreUtils.getDocById(
        `groups/${groupId}/announcements`,
        startAfter,
      );
      if (startAfterDoc) {
        query = query.startAfter(startAfterDoc);
      }
    }

    // Get announcements
    const announcements = await firestoreUtils.getDocs(query);

    return announcements;
  } catch (error) {
    logger.error(`Error getting group announcements: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Get a single announcement by ID
 */
export const getAnnouncementById = async (
  userId: string,
  groupId: string,
  announcementId: string,
) => {
  try {
    // Verify the group exists and user is a member
    await getGroupById(userId, groupId);

    // Get the announcement
    const announcement = await firestoreUtils.getDocById(
      `groups/${groupId}/announcements`,
      announcementId,
    );

    if (!announcement) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        ERROR_MESSAGES.ANNOUNCEMENT_NOT_FOUND,
      );
    }

    return announcement;
  } catch (error) {
    logger.error(`Error getting announcement: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Create a new announcement
 */
export const createAnnouncement = async (
  userId: string,
  groupId: string,
  data: AnnouncementCreationData,
) => {
  try {
    // Verify the group exists and user is a member
    const group = await getGroupById(userId, groupId);

    // Get user display name
    const userDoc = await firestoreUtils.getDocById<UserProfile>(
      'users',
      userId,
    );

    if (!userDoc) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Generate ID for the announcement
    const announcementId = firestoreUtils.generateId();

    // Create announcement object
    const announcement: Announcement = {
      id: announcementId,
      groupId,
      title: data.title,
      content: data.content,
      isPinned: data.isPinned || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      authorName: userDoc.displayName,
      expiresAt: data.expiresAt,
    };

    // Save to firestore
    await firestoreUtils.setDoc(
      `groups/${groupId}/announcements/${announcementId}`,
      announcement,
    );

    // If the announcement is pinned and there's a limit, unpin the oldest
    if (announcement.isPinned) {
      await managePinnedAnnouncements(groupId);
    }

    // Return the new announcement
    return announcement;
  } catch (error) {
    logger.error(`Error creating announcement: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Update an announcement
 */
export const updateAnnouncement = async (
  userId: string,
  groupId: string,
  announcementId: string,
  data: AnnouncementUpdateData,
) => {
  try {
    // Verify the group exists and user is a member
    const group = await getGroupById(userId, groupId);

    // Get the announcement
    const announcement = await firestoreUtils.getDocById<Announcement>(
      `groups/${groupId}/announcements`,
      announcementId,
    );

    if (!announcement) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        ERROR_MESSAGES.ANNOUNCEMENT_NOT_FOUND,
      );
    }

    // Only creator or group admin can update
    if (announcement.createdBy !== userId && !group.isAdmin) {
      throw new ApiError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);
    }

    // Check if announcement is being pinned
    const wasPinned = announcement.isPinned;
    const isPinned = data.isPinned !== undefined ? data.isPinned : wasPinned;

    // Update announcement
    const updateData: Partial<Announcement> = {
      updatedAt: new Date(),
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.isPinned !== undefined) updateData.isPinned = data.isPinned;
    if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt;

    await firestoreUtils.updateDoc(
      `groups/${groupId}/announcements/${announcementId}`,
      updateData,
    );

    // If the announcement is newly pinned, check pin limits
    if (!wasPinned && isPinned) {
      await managePinnedAnnouncements(groupId);
    }

    // Get the updated announcement
    return await firestoreUtils.getDoc(
      firestoreUtils.docRef(
        `groups/${groupId}/announcements/${announcementId}`,
      ),
    );
  } catch (error) {
    logger.error(`Error updating announcement: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Delete an announcement
 */
export const deleteAnnouncement = async (
  userId: string,
  groupId: string,
  announcementId: string,
) => {
  try {
    // Verify the group exists and user is a member
    const group = await getGroupById(userId, groupId);

    // Get the announcement
    const announcement = await firestoreUtils.getDocById<Announcement>(
      `groups/${groupId}/announcements`,
      announcementId,
    );

    if (!announcement) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        ERROR_MESSAGES.ANNOUNCEMENT_NOT_FOUND,
      );
    }

    // Only creator or group admin can delete
    if (announcement.createdBy !== userId && !group.isAdmin) {
      throw new ApiError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);
    }

    // Delete the announcement
    await firestoreUtils.deleteDoc(
      `groups/${groupId}/announcements/${announcementId}`,
    );

    return {success: true};
  } catch (error) {
    logger.error(`Error deleting announcement: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Manage pinned announcements (limit to 3 most recent)
 */
export const managePinnedAnnouncements = async (groupId: string) => {
  try {
    // Get all pinned announcements, ordered by creation date
    const pinnedAnnouncements = await firestoreUtils.getDocs(
      firestoreUtils
        .colRef<Announcement>(`groups/${groupId}/announcements`)
        .where('isPinned', '==', true)
        .orderBy('createdAt', 'desc'),
    );

    // If we have more than 3 pinned announcements, unpin the oldest ones
    const MAX_PINNED = 3;
    if (pinnedAnnouncements.length > MAX_PINNED) {
      // Get the announcements to unpin
      const toUnpin = pinnedAnnouncements.slice(MAX_PINNED);

      // Unpin them
      for (const announcement of toUnpin) {
        await firestoreUtils.updateDoc(
          `groups/${groupId}/announcements/${announcement.id}`,
          {isPinned: false, updatedAt: new Date()},
        );
      }
    }
  } catch (error) {
    logger.error(`Error managing pinned announcements: ${error}`);
    throw error;
  }
};

/**
 * Get expired announcements
 */
export const getExpiredAnnouncements = async (groupId: string) => {
  try {
    const now = new Date();

    // Get all expired announcements
    const expiredAnnouncements = await firestoreUtils.getDocs(
      firestoreUtils
        .colRef<Announcement>(`groups/${groupId}/announcements`)
        .where('expiresAt', '<=', now),
    );

    return expiredAnnouncements;
  } catch (error) {
    logger.error(`Error getting expired announcements: ${error}`);
    throw error;
  }
};

/**
 * Clean up expired announcements
 */
export const cleanupExpiredAnnouncements = async (groupId: string) => {
  try {
    const expiredAnnouncements = await getExpiredAnnouncements(groupId);

    // Delete expired announcements
    for (const announcement of expiredAnnouncements) {
      await firestoreUtils.deleteDoc(
        `groups/${groupId}/announcements/${announcement.id}`,
      );
    }

    return {
      success: true,
      count: expiredAnnouncements.length,
    };
  } catch (error) {
    logger.error(`Error cleaning up expired announcements: ${error}`);
    throw error;
  }
};
