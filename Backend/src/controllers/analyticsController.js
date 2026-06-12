import Analytics from "../models/Analytics.js";
import Resume from "../models/Resume.js";
import User from "../models/User.js";

// @desc    Get user dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Parallel data fetching
    const [
      user,
      resumeStats,
      eventStats,
      dailyStats,
      topResumes,
      recentActivity,
    ] = await Promise.all([
      User.findById(userId).select("stats subscription"),
      // Resume aggregate stats
      Resume.aggregate([
        { $match: { user: userId, isArchived: false } },
        {
          $group: {
            _id: null,
            totalResumes: { $sum: 1 },
            totalViews: { $sum: "$analytics.views" },
            totalDownloads: { $sum: "$analytics.downloads" },
            avgATSScore: { $avg: "$atsScore.overall" },
            drafts: { $sum: { $cond: ["$isDraft", 1, 0] } },
            published: { $sum: { $cond: ["$isPublic", 1, 0] } },
            byTemplate: { $push: "$template" },
          },
        },
      ]),
      // Event type breakdown
      Analytics.aggregate([
        { $match: { user: userId, timestamp: { $gte: startDate } } },
        { $group: { _id: "$eventType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      // Daily activity
      Analytics.getDailyStats(userId, parseInt(days)),
      // Top performing resumes
      Resume.find({ user: userId, isArchived: false })
        .sort({ "analytics.views": -1 })
        .limit(5)
        .select("title analytics atsScore template"),
      // Recent activity
      Analytics.find({ user: userId })
        .sort({ timestamp: -1 })
        .limit(10)
        .populate("resume", "title"),
    ]);

    const stats = resumeStats[0] || {
      totalResumes: 0,
      totalViews: 0,
      totalDownloads: 0,
      avgATSScore: 0,
    };

    // Template distribution
    const templateCounts = {};
    if (stats.byTemplate) {
      stats.byTemplate.forEach((t) => {
        templateCounts[t] = (templateCounts[t] || 0) + 1;
      });
    }

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalResumes: stats.totalResumes,
          totalViews: stats.totalViews,
          totalDownloads: stats.totalDownloads,
          avgATSScore: Math.round(stats.avgATSScore || 0),
          drafts: stats.drafts || 0,
          published: stats.published || 0,
          subscription: user.subscription,
        },
        eventBreakdown: eventStats,
        dailyActivity: dailyStats,
        topResumes,
        recentActivity,
        templateDistribution: templateCounts,
        userStats: user.stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get resume-specific analytics
// @route   GET /api/analytics/resume/:resumeId
// @access  Private
export const getResumeAnalytics = async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const [resume, events] = await Promise.all([
      Resume.findOne({ _id: resumeId, user: req.user._id }).select(
        "title analytics atsScore"
      ),
      Analytics.aggregate([
        {
          $match: {
            user: req.user._id,
            resume: new (await import("mongoose")).default.Types.ObjectId(resumeId),
            timestamp: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
              type: "$eventType",
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.date": 1 } },
      ]),
    ]);

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found." });
    }

    res.status(200).json({
      success: true,
      data: {
        resume,
        events,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track custom event
// @route   POST /api/analytics/track
// @access  Private
export const trackEvent = async (req, res, next) => {
  try {
    const { eventType, resumeId, metadata } = req.body;

    await Analytics.create({
      user: req.user._id,
      resume: resumeId || null,
      eventType,
      metadata: {
        ...metadata,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });

    res.status(200).json({ success: true, message: "Event tracked." });
  } catch (error) {
    next(error);
  }
};