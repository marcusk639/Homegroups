import {ApiError} from '../middleware/error';
import {STATUS_CODES, ERROR_MESSAGES} from '../utils/constants';
import {
  Meeting,
  MeetingCreationData,
  MeetingUpdateData,
} from '../types/meeting';
import logger from '../utils/logger';
import * as firestoreUtils from '../utils/firestore';
import {getGroupById} from './group-service';

/**
 * Create a new meeting
 */
export const createMeeting = async (
  userId: string,
  meetingData: MeetingCreationData,
) => {
  try {
    // Verify the group exists and user is a member
    await getGroupById(userId, meetingData.groupId);

    // Generate a unique ID for the meeting
    const meetingId = firestoreUtils.generateId();

    // Prepare the meeting document
    const newMeeting: Partial<Meeting> = {
      ...meetingData,
      id: meetingId,
      attendees: [userId],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create the meeting document
    await firestoreUtils.setDoc(`meetings/${meetingId}`, newMeeting);

    // Get the newly created meeting
    const meeting = await firestoreUtils.getDoc<Meeting>(
      firestoreUtils.docRef<Meeting>(`meetings/${meetingId}`),
    );

    if (!meeting) {
      throw new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      );
    }

    return meeting;
  } catch (error) {
    logger.error(`Error creating meeting: ${error}`);

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
 * Get a specific meeting
 */
export const getMeetingById = async (userId: string, meetingId: string) => {
  try {
    // Get the meeting document
    const meeting = await firestoreUtils.getDoc<Meeting>(
      firestoreUtils.docRef<Meeting>(`meetings/${meetingId}`),
    );

    if (!meeting) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        ERROR_MESSAGES.MEETING_NOT_FOUND,
      );
    }

    // Verify the user is a member of the group
    await getGroupById(userId, meeting.groupId);

    return meeting;
  } catch (error) {
    logger.error(`Error getting meeting: ${error}`);

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
 * Update a meeting
 */
export const updateMeeting = async (
  userId: string,
  meetingId: string,
  meetingData: MeetingUpdateData,
) => {
  try {
    // Get the meeting document
    const meeting = await firestoreUtils.getDoc<Meeting>(
      firestoreUtils.docRef<Meeting>(`meetings/${meetingId}`),
    );

    if (!meeting) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        ERROR_MESSAGES.MEETING_NOT_FOUND,
      );
    }

    // Verify the user is a member of the group
    const group = await getGroupById(userId, meeting.groupId);

    // Only group admins can update meetings
    if (!group.isAdmin) {
      throw new ApiError(
        STATUS_CODES.FORBIDDEN,
        ERROR_MESSAGES.NOT_GROUP_ADMIN,
      );
    }

    // Update the meeting document
    await firestoreUtils.updateDoc<Meeting>(`meetings/${meetingId}`, {
      ...meetingData,
      updatedAt: new Date(),
    });

    // Get the updated meeting
    const updatedMeeting = await firestoreUtils.getDoc<Meeting>(
      firestoreUtils.docRef<Meeting>(`meetings/${meetingId}`),
    );

    if (!updatedMeeting) {
      throw new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      );
    }

    return updatedMeeting;
  } catch (error) {
    logger.error(`Error updating meeting: ${error}`);

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
 * Delete a meeting
 */
export const deleteMeeting = async (userId: string, meetingId: string) => {
  try {
    // Get the meeting document
    const meeting = await firestoreUtils.getDoc<Meeting>(
      firestoreUtils.docRef<Meeting>(`meetings/${meetingId}`),
    );

    if (!meeting) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        ERROR_MESSAGES.MEETING_NOT_FOUND,
      );
    }

    // Verify the user is a member of the group
    const group = await getGroupById(userId, meeting.groupId);

    // Only group admins can delete meetings
    if (!group.isAdmin) {
      throw new ApiError(
        STATUS_CODES.FORBIDDEN,
        ERROR_MESSAGES.NOT_GROUP_ADMIN,
      );
    }

    // Delete the meeting document
    await firestoreUtils.deleteDoc(`meetings/${meetingId}`);
  } catch (error) {
    logger.error(`Error deleting meeting: ${error}`);

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
 * Get all meetings for a group
 */
export const getGroupMeetings = async (userId: string, groupId: string) => {
  try {
    // Verify the group exists and user is a member
    await getGroupById(userId, groupId);

    // Get all meetings for the group
    const meetings = await firestoreUtils.getDocs<Meeting>(
      firestoreUtils
        .colRef<Meeting>(`meetings`)
        .where('groupId', '==', groupId)
        .orderBy('date', 'desc'),
    );

    return meetings;
  } catch (error) {
    logger.error(`Error getting group meetings: ${error}`);

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
 * Join a meeting
 */
export const joinMeeting = async (userId: string, meetingId: string) => {
  try {
    // Get the meeting document
    const meeting = await firestoreUtils.getDoc<Meeting>(
      firestoreUtils.docRef<Meeting>(`meetings/${meetingId}`),
    );

    if (!meeting) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        ERROR_MESSAGES.MEETING_NOT_FOUND,
      );
    }

    // Verify the user is a member of the group
    await getGroupById(userId, meeting.groupId);

    // Add the user to the attendees array if not already present
    if (!meeting.attendees.includes(userId)) {
      await firestoreUtils.updateDoc<Meeting>(`meetings/${meetingId}`, {
        attendees: [...meeting.attendees, userId],
        updatedAt: new Date(),
      });
    }

    // Get the updated meeting
    const updatedMeeting = await firestoreUtils.getDoc<Meeting>(
      firestoreUtils.docRef<Meeting>(`meetings/${meetingId}`),
    );

    if (!updatedMeeting) {
      throw new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      );
    }

    return updatedMeeting;
  } catch (error) {
    logger.error(`Error joining meeting: ${error}`);

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
 * Leave a meeting
 */
export const leaveMeeting = async (userId: string, meetingId: string) => {
  try {
    // Get the meeting document
    const meeting = await firestoreUtils.getDoc<Meeting>(
      firestoreUtils.docRef<Meeting>(`meetings/${meetingId}`),
    );

    if (!meeting) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        ERROR_MESSAGES.MEETING_NOT_FOUND,
      );
    }

    // Remove the user from the attendees array if present
    if (meeting.attendees.includes(userId)) {
      await firestoreUtils.updateDoc<Meeting>(`meetings/${meetingId}`, {
        attendees: meeting.attendees.filter((id: string) => id !== userId),
        updatedAt: new Date(),
      });
    }

    // Get the updated meeting
    const updatedMeeting = await firestoreUtils.getDoc<Meeting>(
      firestoreUtils.docRef<Meeting>(`meetings/${meetingId}`),
    );

    if (!updatedMeeting) {
      throw new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      );
    }

    return updatedMeeting;
  } catch (error) {
    logger.error(`Error leaving meeting: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    );
  }
};
