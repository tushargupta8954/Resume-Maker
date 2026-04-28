import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  startDate: { type: Date, required: true },
  endDate: Date,
  isCurrentlyWorking: { type: Boolean, default: false },
  description: String,
  achievements: [String],
  aiEnhanced: { type: Boolean, default: false },
});

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  location: String,
  startDate: Date,
  endDate: Date,
  gpa: String,
  achievements: [String],
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  technologies: [String],
  link: String,
  githubLink: String,
  startDate: Date,
  endDate: Date,
  highlights: [String],
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: String,
  dateIssued: Date,
  expiryDate: Date,
  credentialId: String,
  credentialUrl: String,
});

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: 'Untitled Resume',
    },
    template: {
      type: String,
      enum: ['modern', 'classic', 'creative', 'minimal', 'professional', 'executive'],
      default: 'modern',
    },
    personalInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: String,
      location: String,
      linkedIn: String,
      github: String,
      portfolio: String,
      website: String,
      profileImage: {
        url: String,
        publicId: String,
      },
    },
    professionalSummary: {
      text: String,
      aiGenerated: { type: Boolean, default: false },
      lastUpdated: Date,
    },
    experience: [experienceSchema],
    education: [educationSchema],
    skills: {
      technical: [String],
      soft: [String],
      languages: [
        {
          name: String,
          proficiency: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', 'native'],
          },
        },
      ],
      aiSuggested: [String],
    },
    projects: [projectSchema],
    certifications: [certificationSchema],
    achievements: [String],
    customSections: [
      {
        title: String,
        content: String,
        order: Number,
      },
    ],
    sectionOrder: {
      type: [String],
      default: [
        'personalInfo',
        'professionalSummary',
        'experience',
        'education',
        'skills',
        'projects',
        'certifications',
      ],
    },
    atsScore: {
      score: { type: Number, min: 0, max: 100 },
      feedback: [String],
      keywords: {
        matched: [String],
        missing: [String],
      },
      lastChecked: Date,
    },
    optimization: {
      targetJobTitle: String,
      targetJobDescription: String,
      optimizedKeywords: [String],
      industrySpecific: Boolean,
    },
    styling: {
      colorScheme: {
        primary: { type: String, default: '#2563eb' },
        secondary: { type: String, default: '#1e40af' },
        accent: { type: String, default: '#3b82f6' },
      },
      font: {
        type: String,
        default: 'Inter',
      },
      fontSize: {
        type: String,
        default: 'medium',
      },
    },
    visibility: {
      type: String,
      enum: ['private', 'public', 'unlisted'],
      default: 'private',
    },
    shareableLink: String,
    downloadCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    pdfUrl: String,
  },
  {
    timestamps: true,
  }
);

// Update lastModified on save
resumeSchema.pre('save', function (next) {
  this.lastModified = Date.now();
  next();
});

// Generate shareable link
resumeSchema.methods.generateShareableLink = function () {
  const randomString = Math.random().toString(36).substring(2, 15);
  this.shareableLink = `${randomString}-${this._id}`;
  return this.shareableLink;
};

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;