import { Request, Response } from "express";
import { AuthRequest } from "../types/auth";
import * as groupService from "../services/group-service";
import { asyncHandler } from "../middleware/error";
import { STATUS_CODES, SUCCESS_MESSAGES } from "../utils/constants";
import logger from "../utils/logger";

/**
 * @desc    Create a new group
 * @route   POST /api/v1/groups
 * @access  Private
 */
export const createGroup = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;
    const groupData = req.body;

    const group = await groupService.createGroup(userId, groupData);

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.GROUP_CREATED,
      data: group,
    });
  }
);

/**
 * @desc    Get all groups a user is a member of
 * @route   GET /api/v1/groups
 * @access  Private
 */
export const getUserGroups = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;

    const groups = await groupService.getUserGroups(userId);

    res.status(STATUS_CODES.OK).json({
      success: true,
      count: groups.length,
      data: groups,
    });
  }
);

/**
 * @desc    Get a group by ID
 * @route   GET /api/v1/groups/:id
 * @access  Private (members only)
 */
export const getGroupById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;
    const groupId = req.params.id;

    const group = await groupService.getGroupById(userId, groupId);

    res.status(STATUS_CODES.OK).json({
      success: true,
      data: group,
    });
  }
);

/**
 * @desc    Update a group
 * @route   PUT /api/v1/groups/:id
 * @access  Private (admins only)
 */
export const updateGroup = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;
    const groupId = req.params.id;
    const groupData = req.body;

    const group = await groupService.updateGroup(userId, groupId, groupData);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.GROUP_UPDATED,
      data: group,
    });
  }
);

/**
 * @desc    Delete a group
 * @route   DELETE /api/v1/groups/:id
 * @access  Private (admins only)
 */
export const deleteGroup = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;
    const groupId = req.params.id;

    await groupService.deleteGroup(userId, groupId);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.GROUP_DELETED,
    });
  }
);

/**
 * @desc    Get all members of a group
 * @route   GET /api/v1/groups/:id/members
 * @access  Private (members only)
 */
export const getGroupMembers = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;
    const groupId = req.params.id;

    const members = await groupService.getGroupMembers(userId, groupId);

    res.status(STATUS_CODES.OK).json({
      success: true,
      count: members.length,
      data: members,
    });
  }
);

/**
 * @desc    Update a member's role in a group
 * @route   PUT /api/v1/groups/:id/members/:memberId
 * @access  Private (admins only)
 */
export const updateMemberRole = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;
    const groupId = req.params.id;
    const memberId = req.params.memberId;
    const { isAdmin, position } = req.body;

    const member = await groupService.updateMemberRole(
      userId,
      groupId,
      memberId,
      isAdmin,
      position
    );

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.MEMBER_ROLE_UPDATED,
      data: member,
    });
  }
);

/**
 * @desc    Remove a member from a group
 * @route   DELETE /api/v1/groups/:id/members/:memberId
 * @access  Private (admins only or self-removal)
 */
export const removeMember = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;
    const groupId = req.params.id;
    const memberId = req.params.memberId;

    // Check if user is removing themselves or is an admin
    const isSelf = userId === memberId;

    if (isSelf) {
      // Self-removal
      await groupService.removeUserFromGroup(userId, groupId);
    } else {
      // Admin removing another member
      const group = await groupService.getGroupById(userId, groupId);

      if (!group.isAdmin) {
        return res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: "Only admins can remove other members",
        });
      }

      await groupService.removeUserFromGroup(memberId, groupId);
    }

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.MEMBER_REMOVED,
    });
  }
);

/**
 * @desc    Get all announcements for a group
 * @route   GET /api/v1/groups/:id/announcements
 * @access  Private (members only)
 */
export const getGroupAnnouncements = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;
    const groupId = req.params.id;

    const announcements = await groupService.getGroupAnnouncements(
      userId,
      groupId
    );

    res.status(STATUS_CODES.OK).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  }
);

/**
 * @desc    Create a new announcement for a group
 * @route   POST /api/v1/groups/:id/announcements
 * @access  Private (members only)
 */
export const createAnnouncement = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;
    const groupId = req.params.id;
    const { title, content, isPinned, expiresAt } = req.body;

    const announcement = await groupService.createAnnouncement(
      userId,
      groupId,
      title,
      content,
      isPinned,
      expiresAt ? new Date(expiresAt) : undefined
    );

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.ANNOUNCEMENT_CREATED,
      data: announcement,
    });
  }
);

/**
 * @desc    Update an announcement
 * @route   PUT /api/v1/groups/:id/announcements/:announcementId
 * @access  Private (author or admin)
 */
export const updateAnnouncement = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;
    const groupId = req.params.id;
    const announcementId = req.params.announcementId;
    const { title, content, isPinned, expiresAt } = req.body;

    const announcement = await groupService.updateAnnouncement(
      userId,
      groupId,
      announcementId,
      title,
      content,
      isPinned,
      expiresAt ? new Date(expiresAt) : undefined
    );

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.ANNOUNCEMENT_UPDATED,
      data: announcement,
    });
  }
);

/**
 * @desc    Delete an announcement
 * @route   DELETE /api/v1/groups/:id/announcements/:announcementId
 * @access  Private (author or admin)
 */
export const deleteAnnouncement = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;
    const groupId = req.params.id;
    const announcementId = req.params.announcementId;

    await groupService.deleteAnnouncement(userId, groupId, announcementId);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.ANNOUNCEMENT_DELETED,
    });
  }
);

/**
 * @desc    Get all events for a group
 * @route   GET /api/v1/groups/:id/events
 * @access  Private (members only)
 */
export const getGroupEvents = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;
    const groupId = req.params.id;

    const events = await groupService.getGroupEvents(userId, groupId);

    res.status(STATUS_CODES.OK).json({
      success: true,
      count: events.length,
      data: events,
    });
  }
);

/**
 * @desc    Create a new event for a group
 * @route   POST /api/v1/groups/:id/events
 * @access  Private (members only)
 */
export const createEvent = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;
    const groupId = req.params.id;
    const {
      title,
      description,
      date,
      time,
      duration,
      location,
      isOnline,
      address,
      onlineLink,
    } = req.body;

    const event = await groupService.createEvent(
      userId,
      groupId,
      title,
      description,
      date,
      time,
      duration,
      location,
      isOnline,
      address,
      onlineLink
    );

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.EVENT_CREATED,
      data: event,
    });
  }
);

/**
 * @desc    Get upcoming celebrations for a group
 * @route   GET /api/v1/groups/:id/celebrations
 * @access  Private (members only)
 */
export const getGroupCelebrations = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;
    const groupId = req.params.id;

    const celebrations = await groupService.getGroupCelebrations(
      userId,
      groupId
    );

    res.status(STATUS_CODES.OK).json({
      success: true,
      count: celebrations.length,
      data: celebrations,
    });
  }
);
