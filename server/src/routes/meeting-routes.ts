<<<<<<< HEAD
import express from 'express';
import {authenticate} from '../middleware/auth';
=======
import express from "express";
import { authenticate } from "../middleware/auth";
>>>>>>> monorepo-setup
import {
  createMeeting,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  getGroupMeetings,
  joinMeeting,
  leaveMeeting,
<<<<<<< HEAD
} from '../controllers/meeting-controller';
=======
} from "../controllers/meeting-controller";
>>>>>>> monorepo-setup

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create a new meeting
<<<<<<< HEAD
router.post('/', createMeeting);

// Get a specific meeting
router.get('/:meetingId', getMeetingById);

// Update a meeting
router.put('/:meetingId', updateMeeting);

// Delete a meeting
router.delete('/:meetingId', deleteMeeting);

// Get all meetings for a group
router.get('/group/:groupId', getGroupMeetings);

// Join a meeting
router.post('/:meetingId/join', joinMeeting);

// Leave a meeting
router.post('/:meetingId/leave', leaveMeeting);
=======
router.post("/", createMeeting);

// Get a specific meeting
router.get("/:meetingId", getMeetingById);

// Update a meeting
router.put("/:meetingId", updateMeeting);

// Delete a meeting
router.delete("/:meetingId", deleteMeeting);

// Get all meetings for a group
router.get("/group/:groupId", getGroupMeetings);

// Join a meeting
router.post("/:meetingId/join", joinMeeting);

// Leave a meeting
router.post("/:meetingId/leave", leaveMeeting);
>>>>>>> monorepo-setup

export default router;
