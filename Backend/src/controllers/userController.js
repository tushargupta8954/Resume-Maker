import User from '../models/User.js';
import Resume from '../models/Resume.js';
import Analytics from '../models/Analytics.js';
import cloudinary from '../config/cloudinary.js';
import { validationResult } from 'express-validator';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('resumes');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update allowed fields
    const { firstName, lastName, phone, preferences } = req.body;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences,
      };
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profileImage: updatedUser.profileImage,
        subscription: updatedUser.subscription,
        preferences: updatedUser.preferences,
        resumeCount: updatedUser.resumeCount,
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Upload/Update profile picture
// @route   POST /api/users/profile-picture
// @access  Private
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Delete old image from cloudinary if exists
    if (user.profileImage?.publicId) {
      await cloudinary.uploader.destroy(user.profileImage.publicId);
    }

    // Upload new image
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'resume-builder/profile-pictures',
      transformation: [
        { width: 400, height: 400, crop: 'fill' },
        { quality: 'auto' },
      ],
    });

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
      message: 'Profile picture uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete profile picture
// @route   DELETE /api/users/profile-picture
// @access  Private
export const deleteProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.profileImage?.publicId) {
      return res.status(400).json({
        success: false,
        message: 'No profile picture to delete',
      });
    }

    // Delete from cloudinary
    await cloudinary.uploader.destroy(user.profileImage.publicId);

    // Remove from user
    user.profileImage = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile picture deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get all user resumes
    const resumes = await Resume.find({ user: req.user._id });

    // Calculate statistics
    const totalResumes = resumes.length;
    const totalViews = resumes.reduce((sum, resume) => sum + (resume.viewCount || 0), 0);
    const totalDownloads = resumes.reduce(
      (sum, resume) => sum + (resume.downloadCount || 0),
      0
    );

    // Calculate average ATS score
    const resumesWithScore = resumes.filter((r) => r.atsScore?.score);
    const avgAtsScore =
      resumesWithScore.length > 0
        ? Math.round(
            resumesWithScore.reduce((sum, r) => sum + r.atsScore.score, 0) /
              resumesWithScore.length
          )
        : 0;

    // Get recent activity
    const recentResumes = resumes
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5)
      .map((resume) => ({
        _id: resume._id,
        title: resume.title,
        updatedAt: resume.updatedAt,
        atsScore: resume.atsScore?.score || null,
      }));

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalResumes,
          totalViews,
          totalDownloads,
          avgAtsScore,
        },
        recentActivity: recentResumes,
        accountInfo: {
          memberSince: user.createdAt,
          subscription: user.subscription,
          lastLogin: user.lastLogin,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user analytics
// @route   GET /api/users/analytics
// @access  Private
export const getUserAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Get all user analytics
    const analytics = await Analytics.find({
      user: req.user._id,
      createdAt: { $gte: daysAgo },
    }).populate('resume', 'title template');

    // Aggregate data
    const aggregatedData = {
      totalEvents: 0,
      eventsByType: {
        view: 0,
        download: 0,
        share: 0,
        edit: 0,
        ats_check: 0,
        ai_enhance: 0,
      },
      resumePerformance: {},
      atsScoreProgress: [],
    };

    analytics.forEach((analytic) => {
      // Count events
      aggregatedData.totalEvents += analytic.events.length;

      analytic.events.forEach((event) => {
        if (aggregatedData.eventsByType[event.eventType] !== undefined) {
          aggregatedData.eventsByType[event.eventType]++;
        }
      });

      // Resume performance
      if (analytic.resume) {
        const resumeId = analytic.resume._id.toString();
        if (!aggregatedData.resumePerformance[resumeId]) {
          aggregatedData.resumePerformance[resumeId] = {
            title: analytic.resume.title,
            views: 0,
            downloads: 0,
            shares: 0,
          };
        }

        analytic.events.forEach((event) => {
          if (event.eventType === 'view')
            aggregatedData.resumePerformance[resumeId].views++;
          if (event.eventType === 'download')
            aggregatedData.resumePerformance[resumeId].downloads++;
          if (event.eventType === 'share')
            aggregatedData.resumePerformance[resumeId].shares++;
        });
      }

      // ATS score progress
      if (analytic.atsScoreHistory && analytic.atsScoreHistory.length > 0) {
        aggregatedData.atsScoreProgress.push(
          ...analytic.atsScoreHistory.map((score) => ({
            score: score.score,
            date: score.checkedAt,
            jobTitle: score.jobTitle,
          }))
        );
      }
    });

    // Convert resume performance to array
    aggregatedData.resumePerformance = Object.values(
      aggregatedData.resumePerformance
    );

    // Sort ATS score progress by date
    aggregatedData.atsScoreProgress.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    res.status(200).json({
      success: true,
      data: aggregatedData,
      period: `${period} days`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
export const updateUserPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { defaultTemplate, aiAssistanceEnabled, notificationsEnabled } = req.body;

    if (defaultTemplate) {
      user.preferences.defaultTemplate = defaultTemplate;
    }

    if (aiAssistanceEnabled !== undefined) {
      user.preferences.aiAssistanceEnabled = aiAssistanceEnabled;
    }

    if (notificationsEnabled !== undefined) {
      user.preferences.notificationsEnabled = notificationsEnabled;
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user.preferences,
      message: 'Preferences updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
export const deleteUserAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your password to confirm deletion',
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password',
      });
    }

    // Delete user's resumes
    await Resume.deleteMany({ user: req.user._id });

    // Delete user's analytics
    await Analytics.deleteMany({ user: req.user._id });

    // Delete profile picture from cloudinary
    if (user.profileImage?.publicId) {
      await cloudinary.uploader.destroy(user.profileImage.publicId);
    }

    // Delete user
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update subscription
// @route   PUT /api/users/subscription
// @access  Private
export const updateSubscription = async (req, res) => {
  try {
    const { subscription } = req.body;

    if (!['free', 'pro', 'enterprise'].includes(subscription)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription type',
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.subscription = subscription;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        subscription: user.subscription,
      },
      message: 'Subscription updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify email
// @route   POST /api/users/verify-email
// @access  Private
export const verifyEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isEmailVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};