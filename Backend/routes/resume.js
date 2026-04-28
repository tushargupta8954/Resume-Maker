import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
  exportToPDF
} from '../controllers/resumeController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createResume)
  .get(getResumes);

router.route('/:id')
  .get(getResumeById)
  .put(updateResume)
  .delete(deleteResume);

router.get('/:id/export', exportToPDF);

export default router;