import express from "express";
import {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
  toggleArchiveResume,
  trackDownload,
  getPublicResume,
} from "../controllers/resumeController.js";
import { protect, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Public route
router.get("/public/:slug", optionalAuth, getPublicResume);

// Protected routes
router.use(protect);

router.route("/").get(getResumes).post(createResume);

router.route("/:id").get(getResume).put(updateResume).delete(deleteResume);

router.post("/:id/duplicate", duplicateResume);
router.patch("/:id/archive", toggleArchiveResume);
router.post("/:id/download", trackDownload);

export default router;