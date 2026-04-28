import express from 'express';
import {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
  shareResume,
  getResumeByShareLink,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/share/:shareableLink', getResumeByShareLink);

// Protected routes
router.use(protect);

router.route('/').get(getResumes).post(createResume);

router.route('/:id').get(getResume).put(updateResume).delete(deleteResume);

router.post('/:id/duplicate', duplicateResume);
router.post('/:id/share', shareResume);

export default router;