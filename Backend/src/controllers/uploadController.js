import cloudinary from '../config/cloudinary.js';
import sharp from 'sharp';
import axios from 'axios';
import User from '../models/User.js';
import Resume from '../models/Resume.js';

// @desc    Upload profile image with background removal
// @route   POST /api/upload/profile-image
// @access  Private
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    // Optimize image with sharp
    const optimizedImage = await sharp(req.file.buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Remove background using Remove.bg API (optional)
    let imageToUpload = optimizedImage;

    if (process.env.REMOVEBG_API_KEY) {
      try {
        const formData = new FormData();
        const blob = new Blob([optimizedImage], { type: 'image/jpeg' });
        formData.append('image_file', blob);
        formData.append('size', 'auto');

        const removeBgResponse = await axios.post(
          'https://api.remove.bg/v1.0/removebg',
          formData,
          {
            headers: {
              'X-Api-Key': process.env.REMOVEBG_API_KEY,
            },
            responseType: 'arraybuffer',
          }
        );

        imageToUpload = Buffer.from(removeBgResponse.data);
      } catch (bgError) {
        console.log('Background removal failed, using original image:', bgError.message);
      }
    }

    // Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'resume-builder/profile-images',
          public_id: `user_${req.user._id}_${Date.now()}`,
          transformation: [
            { width: 400, height: 400, crop: 'fill' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(imageToUpload);
    });

    const result = await uploadPromise;

    // Update user profile
    const user = await User.findById(req.user._id);

    // Delete old image from cloudinary if exists
    if (user.profileImage?.publicId) {
      await cloudinary.uploader.destroy(user.profileImage.publicId);
    }

    user.profileImage = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
      message: 'Profile image uploaded successfully',
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message,
    });
  }
};

// @desc    Upload resume profile image
// @route   POST /api/upload/resume-image/:resumeId
// @access  Private
export const uploadResumeImage = async (req, res) => {
  try {
    const { resumeId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Check ownership
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Optimize image
    const optimizedImage = await sharp(req.file.buffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'resume-builder/resume-images',
          public_id: `resume_${resumeId}_${Date.now()}`,
          transformation: [
            { width: 300, height: 300, crop: 'fill' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(optimizedImage);
    });

    const result = await uploadPromise;

    // Delete old image if exists
    if (resume.personalInfo?.profileImage?.publicId) {
      await cloudinary.uploader.destroy(resume.personalInfo.profileImage.publicId);
    }

    resume.personalInfo.profileImage = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    await resume.save();

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
      message: 'Resume image uploaded successfully',
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message,
    });
  }
};

// @desc    Delete image
// @route   DELETE /api/upload/image/:publicId
// @access  Private
export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message,
    });
  }
};