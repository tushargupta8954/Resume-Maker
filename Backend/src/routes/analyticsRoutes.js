import express from "express";
import {
  getDashboardAnalytics,
  getResumeAnalytics,
  trackEvent,
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/dashboard", getDashboardAnalytics);
router.get("/resume/:resumeId", getResumeAnalytics);
router.post("/track", trackEvent);

export default router;