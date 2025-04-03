import express from 'express';
import {authenticate} from '../middleware/auth';
import {
  getUserProfile,
  updateUserProfile,
  updateUserSettings,
  deleteUserAccount,
} from '../controllers/user-controller';
import {validateRequest} from '../middleware/validation';
import {updateProfileSchema, updateSettingsSchema} from '../types/user';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get user profile
router.get('/profile', getUserProfile);

// Update user profile
router.put('/profile', validateRequest(updateProfileSchema), updateUserProfile);

// Update user settings
router.put(
  '/settings',
  validateRequest(updateSettingsSchema),
  updateUserSettings,
);

// Delete user account
router.delete('/account', deleteUserAccount);

export default router;
