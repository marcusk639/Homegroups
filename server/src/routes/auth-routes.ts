import express from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  resetPassword,
  verifyEmail,
} from '../controllers/auth-controller';
import {validateRequest} from '../middleware/validation';
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '../types/auth';

const router = express.Router();

// Register a new user
router.post('/register', validateRequest(registerSchema), register);

// Login user
router.post('/login', validateRequest(loginSchema), login);

// Logout user
router.post('/logout', logout);

// Refresh access token
router.post('/refresh-token', refreshToken);

// Reset password
router.post(
  '/reset-password',
  validateRequest(resetPasswordSchema),
  resetPassword,
);

// Verify email
router.post('/verify-email', validateRequest(verifyEmailSchema), verifyEmail);

export default router;
