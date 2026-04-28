import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    events: [
      {
        eventType: {
          type: String,
          enum: ['view', 'download', 'share', 'edit', 'ats_check', 'ai_enhance'],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        metadata: {
          type: mongoose.Schema.Types.Mixed,
        },
      },
    ],
    atsScoreHistory: [
      {
        score: Number,
        checkedAt: Date,
        jobTitle: String,
      },
    ],
    performanceMetrics: {
      totalViews: { type: Number, default: 0 },
      totalDownloads: { type: Number, default: 0 },
      totalShares: { type: Number, default: 0 },
      avgAtsScore: { type: Number, default: 0 },
      lastActivityDate: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Update performance metrics
analyticsSchema.methods.updateMetrics = function () {
  const events = this.events;
  this.performanceMetrics.totalViews = events.filter((e) => e.eventType === 'view').length;
  this.performanceMetrics.totalDownloads = events.filter((e) => e.eventType === 'download').length;
  this.performanceMetrics.totalShares = events.filter((e) => e.eventType === 'share').length;

  if (this.atsScoreHistory.length > 0) {
    const sum = this.atsScoreHistory.reduce((acc, curr) => acc + curr.score, 0);
    this.performanceMetrics.avgAtsScore = (sum / this.atsScoreHistory.length).toFixed(2);
  }

  if (events.length > 0) {
    this.performanceMetrics.lastActivityDate = events[events.length - 1].timestamp;
  }
};

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
