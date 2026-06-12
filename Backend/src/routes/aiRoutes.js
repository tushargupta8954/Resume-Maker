import express from "express";
import {
  generateSummary,
  enhanceExperience,
  suggestSkills,
  calculateATSScore,
  customizeForJob,
  optimizeKeywords,
  generateProjectDescription,
  getImprovementTips,
} from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";
import { aiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.use(protect);
router.use(aiLimiter);

router.post("/generate-summary", generateSummary);
router.post("/enhance-experience", enhanceExperience);
router.post("/suggest-skills", suggestSkills);
router.post("/ats-score", calculateATSScore);
router.post("/customize-for-job", customizeForJob);
router.post("/optimize-keywords", optimizeKeywords);
router.post("/generate-project", generateProjectDescription);
router.post("/improvement-tips", getImprovementTips);

export default router;