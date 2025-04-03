<<<<<<< HEAD
import express from 'express';
=======
import express from "express";
>>>>>>> monorepo-setup
import {
  register,
  login,
  logout,
  refreshToken,
  resetPassword,
  verifyEmail,
<<<<<<< HEAD
} from '../controllers/auth-controller';
import {validateRequest} from '../middleware/validation';
=======
} from "../controllers/auth-controller";
import { validateRequest } from "../middleware/validation";
>>>>>>> monorepo-setup
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  verifyEmailSchema,
<<<<<<< HEAD
} from '../types/auth';
=======
} from "../types/auth";
>>>>>>> monorepo-setup

const router = express.Router();

// Register a new user
<<<<<<< HEAD
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
=======
router.post("/register", validateRequest(registerSchema), register);

// Login user
router.post("/login", validateRequest(loginSchema), login);

// Logout user
router.post("/logout", logout);

// Refresh access token
router.post("/refresh-token", refreshToken);

// Reset password
router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  resetPassword
);

// Verify email
router.post("/verify-email", validateRequest(verifyEmailSchema), verifyEmail);
>>>>>>> monorepo-setup

export default router;
