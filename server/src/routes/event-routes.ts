import express from 'express';
import {authenticate} from '../middleware/auth';
import {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getGroupEvents,
  joinEvent,
  leaveEvent,
} from '../controllers/event-controller';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create a new event
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

export default router;
