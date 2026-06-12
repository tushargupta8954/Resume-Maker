import Resume from "../models/Resume.js";
import User from "../models/User.js";
import Analytics from "../models/Analytics.js";
import { paginate, generatePublicLink } from "../utils/helpers.js";
import { v4 as uuidv4 } from "uuid";

// @desc    Get all user resumes
// @route   GET /api/resumes
// @access  Private
export const getResumes = async (req, res, next) => {
  try {
    const { page, limit, sort = "-createdAt", search, template, archived } = req.query;
    const { skip, limit: limitNum, page: pageNum } = paginate(page, limit);

    const query = {
      user: req.user._id,
      isArchived: archived === "true" ? true : false,
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { "personalInfo.jobTitle": { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (template) query.template = template;

    const [resumes, total] = await Promise.all([
      Resume.find(query).sort(sort).skip(skip).limit(limitNum).select("-targetJobDescription"),
      Resume.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        resumes,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
export const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    // Track view
    resume.analytics.views += 1;
    resume.analytics.lastViewed = new Date();
    await resume.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: { resume },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create resume
// @route   POST /api/resumes
// @access  Private
export const createResume = async (req, res, next) => {
  try {
    const {
      title,
      template,
      colorScheme,
      personalInfo,
      summary,
      experience,
      education,
      skills,
      projects,
      certifications,
      languages,
      targetJobRole,
    } = req.body;

    // Add IDs to array items
    const addIds = (arr) =>
      arr?.map((item) => ({ ...item, id: item.id || uuidv4() })) || [];

    const resume = await Resume.create({
      user: req.user._id,
      title: title || "My Resume",
      template: template || "modern",
      colorScheme,
      personalInfo,
      summary,
      experience: addIds(experience),
      education: addIds(education),
      skills: addIds(skills),
      projects: addIds(projects),
      certifications: addIds(certifications),
      languages: addIds(languages),
      targetJobRole,
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { "stats.resumesCreated": 1 },
    });

    // Track analytics
    await Analytics.create({
      user: req.user._id,
      resume: resume._id,
      eventType: "resume_create",
      metadata: { templateUsed: template || "modern" },
    });

    res.status(201).json({
      success: true,
      message: "Resume created successfully! 🎉",
      data: { resume },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private
export const updateResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    const {
      title,
      template,
      colorScheme,
      font,
      personalInfo,
      summary,
      experience,
      education,
      skills,
      projects,
      certifications,
      languages,
      awards,
      volunteerWork,
      customSections,
      sectionOrder,
      targetJobRole,
      targetJobDescription,
      tags,
      notes,
      isDraft,
      isPublic,
    } = req.body;

    const addIds = (arr) =>
      arr?.map((item) => ({ ...item, id: item.id || uuidv4() }));

    // Build update object
    const updateData = {
      ...(title !== undefined && { title }),
      ...(template !== undefined && { template }),
      ...(colorScheme !== undefined && { colorScheme }),
      ...(font !== undefined && { font }),
      ...(personalInfo !== undefined && { personalInfo }),
      ...(summary !== undefined && { summary }),
      ...(experience !== undefined && { experience: addIds(experience) }),
      ...(education !== undefined && { education: addIds(education) }),
      ...(skills !== undefined && { skills: addIds(skills) }),
      ...(projects !== undefined && { projects: addIds(projects) }),
      ...(certifications !== undefined && {
        certifications: addIds(certifications),
      }),
      ...(languages !== undefined && { languages: addIds(languages) }),
      ...(awards !== undefined && { awards: addIds(awards) }),
      ...(volunteerWork !== undefined && {
        volunteerWork: addIds(volunteerWork),
      }),
      ...(customSections !== undefined && { customSections }),
      ...(sectionOrder !== undefined && { sectionOrder }),
      ...(targetJobRole !== undefined && { targetJobRole }),
      ...(targetJobDescription !== undefined && { targetJobDescription }),
      ...(tags !== undefined && { tags }),
      ...(notes !== undefined && { notes }),
      ...(isDraft !== undefined && { isDraft }),
      ...(isPublic !== undefined && {
        isPublic,
        publicLink: isPublic ? generatePublicLink(resume.slug) : null,
      }),
      $inc: { version: 1 },
    };

    const updatedResume = await Resume.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Track edit
    await Analytics.create({
      user: req.user._id,
      resume: resume._id,
      eventType: "resume_edit",
    });

    res.status(200).json({
      success: true,
      message: "Resume updated successfully.",
      data: { resume: updatedResume },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Duplicate resume
// @route   POST /api/resumes/:id/duplicate
// @access  Private
export const duplicateResume = async (req, res, next) => {
  try {
    const originalResume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!originalResume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    const resumeData = originalResume.toObject();
    delete resumeData._id;
    delete resumeData.slug;
    delete resumeData.createdAt;
    delete resumeData.updatedAt;
    delete resumeData.__v;
    resumeData.title = `${resumeData.title} (Copy)`;
    resumeData.analytics = { views: 0, downloads: 0, shares: 0 };
    resumeData.version = 1;

    const duplicatedResume = await Resume.create(resumeData);

    res.status(201).json({
      success: true,
      message: "Resume duplicated successfully.",
      data: { resume: duplicatedResume },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Archive/Unarchive resume
// @route   PATCH /api/resumes/:id/archive
// @access  Private
export const toggleArchiveResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    resume.isArchived = !resume.isArchived;
    await resume.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `Resume ${resume.isArchived ? "archived" : "unarchived"} successfully.`,
      data: { resume },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track resume download
// @route   POST /api/resumes/:id/download
// @access  Private
export const trackDownload = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        $inc: { "analytics.downloads": 1 },
        "analytics.lastDownloaded": new Date(),
      },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found." });
    }

    // Update user total downloads
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { "stats.totalDownloads": 1 },
    });

    await Analytics.create({
      user: req.user._id,
      resume: resume._id,
      eventType: "resume_download",
    });

    res.status(200).json({ success: true, message: "Download tracked." });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public resume
// @route   GET /api/resumes/public/:slug
// @access  Public
export const getPublicResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      slug: req.params.slug,
      isPublic: true,
      isArchived: false,
    }).populate("user", "firstName lastName profileImage");

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or not public.",
      });
    }

    resume.analytics.views += 1;
    await resume.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: { resume },
    });
  } catch (error) {
    next(error);
  }
};