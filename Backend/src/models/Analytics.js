import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      index: true,
    },
    eventType: {
      type: String,
      enum: [
        "resume_view",
        "resume_download",
        "resume_share",
        "resume_create",
        "resume_edit",
        "ai_summary",
        "ai_enhance",
        "ai_score",
        "ats_check",
        "template_change",
        "login",
        "signup",
        "profile_update",
      ],
      required: true,
    },
    metadata: {
      ipAddress: String,
      userAgent: String,
      referrer: String,
      country: String,
      device: String,
      browser: String,
      templateUsed: String,
      aiTokensUsed: Number,
      atsScoreBefore: Number,
      atsScoreAfter: Number,
      jobRole: String,
    },
    sessionId: String,
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Aggregation: Daily stats
analyticsSchema.statics.getDailyStats = async function (userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        user: userId,
        timestamp: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          eventType: "$eventType",
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.date": 1 } },
  ]);
};

analyticsSchema.index({ user: 1, timestamp: -1 });
analyticsSchema.index({ resume: 1, eventType: 1 });

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;