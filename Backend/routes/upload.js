import express from 'express';
import {
  uploadProfileImage,
  uploadResumeImage,
  deleteImage,
} from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/profile-image', upload.single('image'), uploadProfileImage);
router.post('/resume-image/:resumeId', upload.single('image'), uploadResumeImage);
router.delete('/image/:publicId', deleteImage);

export default router;