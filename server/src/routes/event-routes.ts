<<<<<<< HEAD
import express from 'express';
import {authenticate} from '../middleware/auth';
=======
import express from "express";
import { authenticate } from "../middleware/auth";
>>>>>>> monorepo-setup
import {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getGroupEvents,
  joinEvent,
  leaveEvent,
<<<<<<< HEAD
} from '../controllers/event-controller';
=======
} from "../controllers/event-controller";
>>>>>>> monorepo-setup

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create a new event
<<<<<<< HEAD
router.post('/', createEvent);

// Get a specific event
router.get('/:eventId', getEventById);

// Update an event
router.put('/:eventId', updateEvent);

// Delete an event
router.delete('/:eventId', deleteEvent);

// Get all events for a group
router.get('/group/:groupId', getGroupEvents);

// Join an event
router.post('/:eventId/join', joinEvent);

// Leave an event
router.post('/:eventId/leave', leaveEvent);
=======
router.post("/", createEvent);

// Get a specific event
router.get("/:eventId", getEventById);

// Update an event
router.put("/:eventId", updateEvent);

// Delete an event
router.delete("/:eventId", deleteEvent);

// Get all events for a group
router.get("/group/:groupId", getGroupEvents);

// Join an event
router.post("/:eventId/join", joinEvent);

// Leave an event
router.post("/:eventId/leave", leaveEvent);
>>>>>>> monorepo-setup

export default router;
