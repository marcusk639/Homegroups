import {Router} from 'express';
import {authenticate} from '../middleware/auth';
import {
  createAnnouncement,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getGroupAnnouncements,
} from '../controllers/announcement-controller';
import {validate} from '../middleware/validation';
import {
  announcementCreationSchema,
  announcementUpdateSchema,
  announcementIdSchema,
  announcementPaginationSchema,
} from '../types/announcement';
import {groupIdSchema} from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Group announcements
router.get(
  '/group/:groupId',
  validate(groupIdSchema, 'params'),
  validate(announcementPaginationSchema, 'query'),
  getGroupAnnouncements,
);
router.post(
  '/group/:groupId',
  validate(groupIdSchema, 'params'),
  validate(announcementCreationSchema),
  createAnnouncement,
);

// Single announcement
router.get(
  '/group/:groupId/:announcementId',
  validate(groupIdSchema, 'params'),
  validate(announcementIdSchema, 'params'),
  getAnnouncementById,
);
router.put(
  '/group/:groupId/:announcementId',
  validate(groupIdSchema, 'params'),
  validate(announcementIdSchema, 'params'),
  validate(announcementUpdateSchema),
  updateAnnouncement,
);
router.delete(
  '/group/:groupId/:announcementId',
  validate(groupIdSchema, 'params'),
  validate(announcementIdSchema, 'params'),
  deleteAnnouncement,
);

export default router;
