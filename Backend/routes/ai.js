import express from 'express';
import {
  generateSummary,
  enhanceExperience,
  suggestSkills,
  checkATSCompatibility,
  optimizeForJob,
  getImprovementSuggestions,
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/generate-summary', generateSummary);
router.post('/enhance-experience', enhanceExperience);
router.post('/suggest-skills', suggestSkills);
router.post('/ats-check', checkATSCompatibility);
router.post('/optimize-resume', optimizeForJob);
router.post('/suggestions', getImprovementSuggestions);

export default router;