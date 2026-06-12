import express from 'express';
import { body } from 'express-validator';
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  deleteProfilePicture,
  getUserStats,
  getUserAnalytics,
  updateUserPreferences,
  changePassword,
  deleteUserAccount,
  getAllUsers,
  updateSubscription,
  verifyEmail,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Validation middleware
const updateProfileValidation = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
];

// All routes require authentication
router.use(protect);

// Profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateProfileValidation, updateUserProfile);

// Profile picture routes
router.post('/profile-picture', upload.single('image'), uploadProfilePicture);
router.delete('/profile-picture', deleteProfilePicture);

// Statistics and analytics
router.get('/stats', getUserStats);
router.get('/analytics', getUserAnalytics);

// Preferences
router.put('/preferences', updateUserPreferences);

// Security
router.put('/change-password', changePassword);

// Account deletion
router.delete('/account', deleteUserAccount);

// Subscription
router.put('/subscription', updateSubscription);

// Email verification
router.post('/verify-email', verifyEmail);

// Admin routes
router.get('/', authorize('pro', 'enterprise'), getAllUsers);

export default router;