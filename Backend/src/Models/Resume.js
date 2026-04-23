import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  startDate: Date,
  endDate: Date,
  current: Boolean,
  description: [String],
  achievements: [String]
});

const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  field: String,
  startDate: Date,
  endDate: Date,
  grade: String,
  description: String
});

const skillSchema = new mongoose.Schema({
  name: String,
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  },
  category: String
});

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  technologies: [String],
  link: String,
  github: String,
  image: String
});

const certificationSchema = new mongoose.Schema({
  name: String,
  issuer: String,
  date: Date,
  credentialId: String,
  url: String
});

const languageSchema = new mongoose.Schema({
  name: String,
  proficiency: {
    type: String,
    enum: ['Basic', 'Conversational', 'Professional', 'Native']
  }
});

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'My Resume'
  },
  template: {
    type: String,
    enum: ['modern', 'classic', 'creative', 'minimal', 'professional'],
    default: 'modern'
  },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    portfolio: String,
    professionalSummary: String,
    profileImage: {
      url: String,
      publicId: String
    }
  },
  experience: [experienceSchema],
  education: [educationSchema],
  skills: [skillSchema],
  projects: [projectSchema],
  certifications: [certificationSchema],
  languages: [languageSchema],
  customSections: [{
    title: String,
    content: String,
    order: Number
  }],
  atsScore: {
    score: Number,
    feedback: [String],
    keywords: [String],
    lastAnalyzed: Date
  },
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  shareableLink: String,
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Index for faster queries
resumeSchema.index({ user: 1, createdAt: -1 });
resumeSchema.index({ 'personalInfo.firstName': 'text', 'personalInfo.lastName': 'text' });

export default mongoose.model('Resume', resumeSchema);