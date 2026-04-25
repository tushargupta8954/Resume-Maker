import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  generateSummary,
  enhanceDescription,
  suggestSkills,
  analyzeATS,
  customizeResume,
  getResumeScore,
  optimizeKeywords
} from '../controllers/aiController.js';

const router = express.Router();

router.use(protect);

router.post('/generate-summary', generateSummary);
router.post('/enhance-description', enhanceDescription);
router.post('/suggest-skills', suggestSkills);
router.post('/analyze-ats', analyzeATS);
router.post('/customize-resume', customizeResume);
router.get('/score/:resumeId', getResumeScore);
router.post('/optimize-keywords', optimizeKeywords);

export default router;