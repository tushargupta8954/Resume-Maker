import mongoose from "mongoose";

// Sub-schemas
const personalInfoSchema = new mongoose.Schema({
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  email: { type: String, trim: true },
  phone: { type: String, trim: true },
  location: { type: String, trim: true },
  linkedin: { type: String, trim: true },
  github: { type: String, trim: true },
  website: { type: String, trim: true },
  portfolio: { type: String, trim: true },
  profileImage: { type: String, default: "" },
  jobTitle: { type: String, trim: true },
});

const experienceSchema = new mongoose.Schema({
  id: { type: String },
  company: { type: String, trim: true },
  position: { type: String, trim: true },
  location: { type: String, trim: true },
  startDate: { type: String },
  endDate: { type: String },
  isCurrentRole: { type: Boolean, default: false },
  description: { type: String },
  achievements: [{ type: String }],
  technologies: [{ type: String }],
  aiEnhanced: { type: Boolean, default: false },
});

const educationSchema = new mongoose.Schema({
  id: { type: String },
  institution: { type: String, trim: true },
  degree: { type: String, trim: true },
  field: { type: String, trim: true },
  location: { type: String, trim: true },
  startDate: { type: String },
  endDate: { type: String },
  gpa: { type: String },
  honors: { type: String },
  relevantCourses: [{ type: String }],
});

const skillSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, trim: true },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced", "expert"],
    default: "intermediate",
  },
  category: { type: String, trim: true },
  yearsOfExperience: { type: Number },
});

const projectSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, trim: true },
  description: { type: String },
  technologies: [{ type: String }],
  liveUrl: { type: String },
  githubUrl: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  highlights: [{ type: String }],
  imageUrl: { type: String },
  aiEnhanced: { type: Boolean, default: false },
});

const certificationSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, trim: true },
  issuer: { type: String, trim: true },
  date: { type: String },
  expiryDate: { type: String },
  credentialId: { type: String },
  url: { type: String },
});

const languageSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, trim: true },
  proficiency: {
    type: String,
    enum: ["basic", "conversational", "proficient", "fluent", "native"],
    default: "proficient",
  },
});

const atsScoreSchema = new mongoose.Schema({
  overall: { type: Number, default: 0, min: 0, max: 100 },
  sections: {
    keywords: { type: Number, default: 0 },
    formatting: { type: Number, default: 0 },
    readability: { type: Number, default: 0 },
    completeness: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
  },
  improvements: [{ type: String }],
  keywords: {
    found: [{ type: String }],
    missing: [{ type: String }],
    density: { type: Number, default: 0 },
  },
  lastChecked: { type: Date, default: Date.now },
  jobDescription: { type: String },
});

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Resume title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
      default: "My Resume",
    },
    slug: {
      type: String,
      unique: true,
    },
    template: {
      type: String,
      enum: [
        "modern",
        "classic",
        "minimal",
        "creative",
        "executive",
        "tech",
        "elegant",
      ],
      default: "modern",
    },
    colorScheme: {
      primary: { type: String, default: "#6366f1" },
      secondary: { type: String, default: "#8b5cf6" },
      accent: { type: String, default: "#06b6d4" },
      background: { type: String, default: "#ffffff" },
      text: { type: String, default: "#1f2937" },
    },
    font: {
      family: { type: String, default: "Inter" },
      size: { type: String, default: "medium" },
    },

    // Resume Sections
    personalInfo: personalInfoSchema,
    summary: { type: String, default: "" },
    experience: [experienceSchema],
    education: [educationSchema],
    skills: [skillSchema],
    projects: [projectSchema],
    certifications: [certificationSchema],
    languages: [languageSchema],
    awards: [
      {
        id: String,
        title: String,
        issuer: String,
        date: String,
        description: String,
      },
    ],
    volunteerWork: [
      {
        id: String,
        organization: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    customSections: [
      {
        id: String,
        title: String,
        items: [{ id: String, content: String }],
      },
    ],

    // Section ordering (drag-and-drop)
    sectionOrder: {
      type: [String],
      default: [
        "summary",
        "experience",
        "education",
        "skills",
        "projects",
        "certifications",
        "languages",
        "awards",
      ],
    },

    // AI Features
    aiSummaryGenerated: { type: Boolean, default: false },
    aiEnhancements: { type: Number, default: 0 },
    suggestedSkills: [{ type: String }],
    targetJobRole: { type: String },
    targetJobDescription: { type: String },

    // ATS Score
    atsScore: atsScoreSchema,

    // Analytics
    analytics: {
      views: { type: Number, default: 0 },
      downloads: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      lastViewed: Date,
      lastDownloaded: Date,
    },

    // Settings
    isPublic: { type: Boolean, default: false },
    publicLink: { type: String },
    isArchived: { type: Boolean, default: false },
    isDraft: { type: Boolean, default: true },
    version: { type: Number, default: 1 },
    lastAIInteraction: { type: Date },

    // Metadata
    tags: [{ type: String }],
    notes: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save: Generate slug
resumeSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("title")) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const uniqueSlug = `${baseSlug}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    this.slug = uniqueSlug;
  }
  next();
});

// Virtual: Completion percentage
resumeSchema.virtual("completionPercentage").get(function () {
  let score = 0;
  const checks = [
    this.personalInfo?.firstName,
    this.personalInfo?.email,
    this.personalInfo?.phone,
    this.summary,
    this.experience?.length > 0,
    this.education?.length > 0,
    this.skills?.length > 0,
    this.projects?.length > 0,
  ];
  checks.forEach((check) => {
    if (check) score += 12.5;
  });
  return Math.min(score, 100);
});

// Indexes for performance
resumeSchema.index({ user: 1, createdAt: -1 });
resumeSchema.index({ slug: 1 });
resumeSchema.index({ isPublic: 1 });
resumeSchema.index({ "atsScore.overall": -1 });

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;