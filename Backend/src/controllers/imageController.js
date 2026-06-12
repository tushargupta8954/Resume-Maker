import axios from "axios";
import FormData from "form-data";
import sharp from "sharp";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";
import { uploadToImageKit, deleteFromImageKit } from "../config/imagekit.js";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

// ─── Background Removal via remove.bg ────────────────────────────────────────
const removeBackground = async (imageBuffer) => {
  try {
    const formData = new FormData();
    formData.append("image_file", imageBuffer, {
      filename: "image.png",
      contentType: "image/png",
    });
    formData.append("size", "auto");
    formData.append("format", "png");

    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      formData,
      {
        headers: {
          "X-Api-Key": process.env.REMOVE_BG_API_KEY,
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer",
        timeout: 30000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    return Buffer.from(response.data);
  } catch (error) {
    console.warn(
      "⚠️  Background removal failed, using original image:",
      error.response?.data?.toString() || error.message
    );
    return imageBuffer; // Gracefully fall back to original
  }
};

// ─── Upload Profile Image ─────────────────────────────────────────────────────
// @desc    Upload & process profile image
// @route   POST /api/images/profile
// @access  Private
export const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image file.",
      });
    }

    const shouldRemoveBg =
      req.body.removeBackground === "true" || req.body.removeBackground === true;

    // ── Step 1: Resize & normalise with sharp ──────────────────────────────
    let processedBuffer = await sharp(req.file.buffer)
      .resize(500, 500, { fit: "cover", position: "center" })
      .png({ quality: 95, compressionLevel: 8 })
      .toBuffer();

    // ── Step 2: Remove background (if requested) ───────────────────────────
    if (shouldRemoveBg && process.env.REMOVE_BG_API_KEY) {
      processedBuffer = await removeBackground(processedBuffer);
    }

    // ── Step 3: Create thumbnail ───────────────────────────────────────────
    const thumbnailBuffer = await sharp(processedBuffer)
      .resize(120, 120, { fit: "cover" })
      .png({ quality: 80 })
      .toBuffer();

    // ── Step 4: Delete old images ──────────────────────────────────────────
    const user = await User.findById(req.user._id);
    const oldPublicId = user?.profileImage?.publicId;
    const oldIkFileId = user?.profileImage?.imageKitFileId;

    if (oldPublicId) {
      await deleteFromCloudinary(oldPublicId).catch((e) =>
        console.warn("Cloudinary delete warning:", e.message)
      );
    }
    if (oldIkFileId) {
      await deleteFromImageKit(oldIkFileId).catch((e) =>
        console.warn("ImageKit delete warning:", e.message)
      );
    }

    // ── Step 5: Upload to ImageKit (primary CDN) ───────────────────────────
    let imageKitResult = null;
    if (process.env.IMAGEKIT_PRIVATE_KEY) {
      try {
        imageKitResult = await uploadToImageKit(
          processedBuffer,
          `profile-${req.user._id}.png`,
          "/resume-builder/profiles"
        );
      } catch (err) {
        console.warn("ImageKit upload failed:", err.message);
      }
    }

    // ── Step 6: Upload to Cloudinary (backup / resume embedding) ──────────
    let cloudinaryResult = null;
    try {
      cloudinaryResult = await uploadToCloudinary(
        processedBuffer,
        "resume-builder/profiles",
        {
          public_id: `profile_${req.user._id}_${Date.now()}`,
          overwrite: true,
          invalidate: true,
        }
      );
    } catch (err) {
      console.warn("Cloudinary upload failed:", err.message);
    }

    // At least one upload must succeed
    if (!cloudinaryResult && !imageKitResult) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed on all providers. Please try again.",
      });
    }

    // ── Step 7: Build profileImage object ─────────────────────────────────
    const profileImage = {
      url:
        cloudinaryResult?.secure_url ||
        imageKitResult?.url ||
        "",
      publicId: cloudinaryResult?.public_id || "",
      imageKitFileId: imageKitResult?.fileId || "",
      thumbnailUrl:
        cloudinaryResult?.secure_url ||
        imageKitResult?.thumbnailUrl ||
        "",
    };

    // ── Step 8: Save to DB ─────────────────────────────────────────────────
    await User.findByIdAndUpdate(req.user._id, { profileImage });

    res.status(200).json({
      success: true,
      message: `Profile image uploaded${shouldRemoveBg ? " with background removed" : ""}! 🖼️`,
      data: {
        profileImage,
        backgroundRemoved: shouldRemoveBg,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Delete Profile Image ─────────────────────────────────────────────────────
// @desc    Remove profile image from all providers
// @route   DELETE /api/images/profile
// @access  Private
export const deleteProfileImage = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Delete from Cloudinary
    if (user.profileImage?.publicId) {
      await deleteFromCloudinary(user.profileImage.publicId).catch((e) =>
        console.warn("Cloudinary delete warning:", e.message)
      );
    }

    // Delete from ImageKit
    if (user.profileImage?.imageKitFileId) {
      await deleteFromImageKit(user.profileImage.imageKitFileId).catch((e) =>
        console.warn("ImageKit delete warning:", e.message)
      );
    }

    // Clear DB
    await User.findByIdAndUpdate(req.user._id, {
      profileImage: {
        url: "",
        publicId: "",
        imageKitFileId: "",
        thumbnailUrl: "",
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile image deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ─── Upload Resume Asset ──────────────────────────────────────────────────────
// @desc    Upload project screenshot / resume asset
// @route   POST /api/images/asset
// @access  Private
export const uploadResumeAsset = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image file.",
      });
    }

    const optimizedBuffer = await sharp(req.file.buffer)
      .resize(1024, 768, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();

    const result = await uploadToCloudinary(
      optimizedBuffer,
      "resume-builder/assets",
      { quality: "auto", fetch_format: "auto" }
    );

    res.status(200).json({
      success: true,
      message: "Asset uploaded successfully.",
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    next(error);
  }
};