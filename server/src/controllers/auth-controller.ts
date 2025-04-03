import {Response} from 'express';
import {ApiError} from '../middleware/error';
import {STATUS_CODES, ERROR_MESSAGES} from '../utils/constants';
import * as authService from '../services/auth-service';
import {
  RegisterData,
  LoginData,
  ResetPasswordData,
  VerifyEmailData,
} from '../types/auth';
import {asyncHandler} from '../middleware/error';
import {AuthRequest} from '../types/auth';

/**
 * Register a new user
 */
export const register = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userData: RegisterData = req.body;
    const {uid, token} = await authService.registerUser(userData);
    res.status(STATUS_CODES.CREATED).json({uid, token});
  },
);

/**
 * Login user
 */
export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {email, password}: LoginData = req.body;
  const {uid, token} = await authService.loginUser(email, password);
  res.status(STATUS_CODES.OK).json({uid, token});
});

/**
 * Logout user
 */
export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.uid;
  if (!userId) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
  }
  // In a real app, you might want to invalidate the token here
  res.status(STATUS_CODES.OK).json({message: 'Logged out successfully'});
});

/**
 * Refresh access token
 */
export const refreshToken = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const {refreshToken} = req.body;
    if (!refreshToken) {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Refresh token is required');
    }
    // In a real app, you would validate the refresh token and generate a new access token
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Refresh token not implemented',
    );
  },
);

/**
 * Reset password
 */
export const resetPassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const {email}: ResetPasswordData = req.body;
    await authService.resetPassword(email);
    res.status(STATUS_CODES.OK).json({message: 'Password reset email sent'});
  },
);

/**
 * Verify email
 */
export const verifyEmail = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const {token}: VerifyEmailData = req.body;
    // In a real app, you would verify the email token
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Email verification not implemented',
    );
  },
);
