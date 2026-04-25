import aiService from '../services/aiService.js';
import Resume from '../models/Resume.js';

export const generateSummary = async (req, res) => {
  try {
    const { jobTitle, experience, skills } = req.body;
    const summary = await aiService.generateProfessionalSummary(jobTitle, experience, skills);
    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const enhanceDescription = async (req, res) => {
  try {
    const { jobTitle, description } = req.body;
    const enhanced = await aiService.enhanceExperienceDescription(jobTitle, description);
    res.json({ success: true, enhanced });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const suggestSkills = async (req, res) => {
  try {
    const { jobRole, experience } = req.body;
    const skills = await aiService.suggestSkills(jobRole, experience);
    res.json({ success: true, skills });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const analyzeATS = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    
    const analysis = await aiService.analyzeResumeATS(resume, jobDescription);
    
    // Save ATS score to resume
    resume.atsScore = {
      score: analysis.score,
      feedback: analysis.suggestions,
      keywords: analysis.missingKeywords,
      lastAnalyzed: new Date()
    };
    await resume.save();
    
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const customizeResume = async (req, res) => {
  try {
    const { resumeId, jobDescription, companyName } = req.body;
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    
    const customized = await aiService.customizeResumeForJob(resume, jobDescription, companyName);
    res.json({ success: true, customized });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getResumeScore = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    
    const score = await aiService.getResumeScore(resume);
    res.json({ success: true, score });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const optimizeKeywords = async (req, res) => {
  try {
    const { resumeId, targetRole } = req.body;
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    
    const optimization = await aiService.optimizeKeywords(resume, targetRole);
    res.json({ success: true, optimization });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};