import {Request, Response, NextFunction} from 'express';
import {ApiError} from '../middleware/error';
import {STATUS_CODES, ERROR_MESSAGES} from '../utils/constants';
import {MeetingCreationData, MeetingUpdateData} from '../types/meeting';
import ServiceManager from '../services';

const serviceManager = ServiceManager.getInstance();
const meetingService = serviceManager.getService('meeting');

/**
 * Create a new meeting
 */
export const createMeeting = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED,
      );
    }

    const meetingData: MeetingCreationData = req.body;
    const meeting = await meetingService.createMeeting(userId, meetingData);

    res.status(STATUS_CODES.CREATED).json(meeting);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific meeting
 */
export const getMeetingById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED,
      );
    }

    const {meetingId} = req.params;
    const meeting = await meetingService.getMeetingById(userId, meetingId);

    res.status(STATUS_CODES.OK).json(meeting);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a meeting
 */
export const updateMeeting = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED,
      );
    }

    const {meetingId} = req.params;
    const meetingData: MeetingUpdateData = req.body;
    const meeting = await meetingService.updateMeeting(
      userId,
      meetingId,
      meetingData,
    );

    res.status(STATUS_CODES.OK).json(meeting);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a meeting
 */
export const deleteMeeting = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED,
      );
    }

    const {meetingId} = req.params;
    await meetingService.deleteMeeting(userId, meetingId);

    res.status(STATUS_CODES.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Get all meetings for a group
 */
export const getGroupMeetings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED,
      );
    }

    const {groupId} = req.params;
    const meetings = await meetingService.getGroupMeetings(userId, groupId);

    res.status(STATUS_CODES.OK).json(meetings);
  } catch (error) {
    next(error);
  }
};

/**
 * Join a meeting
 */
export const joinMeeting = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED,
      );
    }

    const {meetingId} = req.params;
    const meeting = await meetingService.joinMeeting(userId, meetingId);

    res.status(STATUS_CODES.OK).json(meeting);
  } catch (error) {
    next(error);
  }
};

/**
 * Leave a meeting
 */
export const leaveMeeting = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED,
      );
    }

    const {meetingId} = req.params;
    const meeting = await meetingService.leaveMeeting(userId, meetingId);

    res.status(STATUS_CODES.OK).json(meeting);
  } catch (error) {
    next(error);
  }
};
