import Resume from '../models/Resume.js';
import User from '../models/User.js';
import Analytics from '../models/Analytics.js';

// @desc    Get all resumes for logged-in user
// @route   GET /api/resumes
// @access  Private
export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
// @access  Private
export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

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
        message: 'Not authorized to access this resume',
      });
    }

    // Track view analytics
    let analytics = await Analytics.findOne({ resume: resume._id });
    if (!analytics) {
      analytics = await Analytics.create({
        user: req.user._id,
        resume: resume._id,
      });
    }

    analytics.events.push({
      eventType: 'view',
      timestamp: new Date(),
    });
    analytics.updateMetrics();
    await analytics.save();

    resume.viewCount += 1;
    await resume.save();

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new resume
// @route   POST /api/resumes
// @access  Private
export const createResume = async (req, res) => {
  try {
    const { title, template, personalInfo } = req.body;

    // Create resume
    const resume = await Resume.create({
      user: req.user._id,
      title: title || 'Untitled Resume',
      template: template || 'modern',
      personalInfo: {
        fullName: personalInfo?.fullName || `${req.user.firstName} ${req.user.lastName}`,
        email: personalInfo?.email || req.user.email,
        phone: personalInfo?.phone || req.user.phone || '',
        ...personalInfo,
      },
    });

    // Update user resume count
    const user = await User.findById(req.user._id);
    user.resumeCount += 1;
    user.resumes.push(resume._id);
    await user.save();

    // Create analytics record
    await Analytics.create({
      user: req.user._id,
      resume: resume._id,
    });

    res.status(201).json({
      success: true,
      data: resume,
      message: 'Resume created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private
export const updateResume = async (req, res) => {
  try {
    let resume = await Resume.findById(req.params.id);

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
        message: 'Not authorized to update this resume',
      });
    }

    // Update resume
    resume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Track edit analytics
    const analytics = await Analytics.findOne({ resume: resume._id });
    if (analytics) {
      analytics.events.push({
        eventType: 'edit',
        timestamp: new Date(),
      });
      await analytics.save();
    }

    res.status(200).json({
      success: true,
      data: resume,
      message: 'Resume updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

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
        message: 'Not authorized to delete this resume',
      });
    }

    await resume.deleteOne();

    // Update user resume count
    const user = await User.findById(req.user._id);
    user.resumeCount -= 1;
    user.resumes = user.resumes.filter((id) => id.toString() !== req.params.id);
    await user.save();

    // Delete analytics
    await Analytics.deleteOne({ resume: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Duplicate resume
// @route   POST /api/resumes/:id/duplicate
// @access  Private
export const duplicateResume = async (req, res) => {
  try {
    const originalResume = await Resume.findById(req.params.id);

    if (!originalResume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Check ownership
    if (originalResume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to duplicate this resume',
      });
    }

    // Create duplicate
    const resumeData = originalResume.toObject();
    delete resumeData._id;
    delete resumeData.createdAt;
    delete resumeData.updatedAt;
    delete resumeData.shareableLink;
    delete resumeData.pdfUrl;
    resumeData.title = `${resumeData.title} (Copy)`;
    resumeData.downloadCount = 0;
    resumeData.viewCount = 0;

    const duplicatedResume = await Resume.create(resumeData);

    // Update user
    const user = await User.findById(req.user._id);
    user.resumeCount += 1;
    user.resumes.push(duplicatedResume._id);
    await user.save();

    // Create analytics
    await Analytics.create({
      user: req.user._id,
      resume: duplicatedResume._id,
    });

    res.status(201).json({
      success: true,
      data: duplicatedResume,
      message: 'Resume duplicated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Generate shareable link
// @route   POST /api/resumes/:id/share
// @access  Private
export const shareResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

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
        message: 'Not authorized to share this resume',
      });
    }

    // Generate shareable link if not exists
    if (!resume.shareableLink) {
      resume.generateShareableLink();
      await resume.save();
    }

    // Track share analytics
    const analytics = await Analytics.findOne({ resume: resume._id });
    if (analytics) {
      analytics.events.push({
        eventType: 'share',
        timestamp: new Date(),
      });
      analytics.updateMetrics();
      await analytics.save();
    }

    const shareUrl = `${process.env.FRONTEND_URL}/share/${resume.shareableLink}`;

    res.status(200).json({
      success: true,
      data: {
        shareableLink: resume.shareableLink,
        shareUrl,
      },
      message: 'Shareable link generated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get resume by shareable link
// @route   GET /api/resumes/share/:shareableLink
// @access  Public
export const getResumeByShareLink = async (req, res) => {
  try {
    const resume = await Resume.findOne({ shareableLink: req.params.shareableLink });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    if (resume.visibility === 'private') {
      return res.status(403).json({
        success: false,
        message: 'This resume is private',
      });
    }

    resume.viewCount += 1;
    await resume.save();

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};