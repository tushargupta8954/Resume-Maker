import express from "express";
import {
  uploadProfileImage,
  deleteProfileImage,
  uploadResumeAsset,
} from "../controllers/imageController.js";
import { protect } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";

const router = express.Router();

router.use(protect);

router
  .route("/profile")
  .post(uploadImage.single("profileImage"), uploadProfileImage)
  .delete(deleteProfileImage);

router.post("/asset", uploadImage.single("image"), uploadResumeAsset);

export default router;