import { getGeminiModel } from '../config/gemini.js';
import Resume from '../models/Resume.js';
import { calculateATSScore, optimizeKeywords } from '../utils/atsScorer.js';

// @desc    Generate professional summary using AI
// @route   POST /api/ai/generate-summary
// @access  Private
export const generateSummary = async (req, res) => {
  try {
    const { jobTitle, experience, skills, tone = 'professional' } = req.body;

    if (!jobTitle) {
      return res.status(400).json({
        success: false,
        message: 'Job title is required',
      });
    }

    const model = getGeminiModel();

    const prompt = `Generate a compelling professional summary for a ${jobTitle} with ${
      experience || 'relevant'
    } experience. 
    
Skills: ${skills?.join(', ') || 'various technical skills'}

Tone: ${tone}

Requirements:
- 3-4 sentences
- Highlight key strengths and achievements
- ATS-friendly
- Engaging and professional
- Focus on value proposition

Generate only the summary text, no additional formatting or explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    res.status(200).json({
      success: true,
      data: {
        summary: summary.trim(),
      },
      message: 'Summary generated successfully',
    });
  } catch (error) {
    console.error('AI Summary Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate summary',
      error: error.message,
    });
  }
};

// @desc    Enhance job experience description
// @route   POST /api/ai/enhance-experience
// @access  Private
export const enhanceExperience = async (req, res) => {
  try {
    const { jobTitle, company, description, achievements } = req.body;

    if (!jobTitle || !description) {
      return res.status(400).json({
        success: false,
        message: 'Job title and description are required',
      });
    }

    const model = getGeminiModel();

    const prompt = `Enhance this job experience description for a resume:

Job Title: ${jobTitle}
Company: ${company || 'Company Name'}
Current Description: ${description}
${achievements ? `Achievements: ${achievements.join(', ')}` : ''}

Requirements:
- Make it more impactful and ATS-friendly
- Use action verbs
- Quantify achievements where possible
- Keep it concise (3-5 bullet points)
- Focus on results and impact

Return only the enhanced description as bullet points, one per line, starting with •`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const enhanced = response.text();

    // Parse bullet points
    const bulletPoints = enhanced
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => line.replace(/^[•\-*]\s*/, '').trim());

    res.status(200).json({
      success: true,
      data: {
        enhanced: bulletPoints,
      },
      message: 'Experience enhanced successfully',
    });
  } catch (error) {
    console.error('AI Enhancement Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enhance experience',
      error: error.message,
    });
  }
};

// @desc    Suggest skills based on job role
// @route   POST /api/ai/suggest-skills
// @access  Private
export const suggestSkills = async (req, res) => {
  try {
    const { jobTitle, industry, experienceLevel = 'mid' } = req.body;

    if (!jobTitle) {
      return res.status(400).json({
        success: false,
        message: 'Job title is required',
      });
    }

    const model = getGeminiModel();

    const prompt = `Suggest relevant skills for a ${jobTitle} position in the ${
      industry || 'tech'
    } industry.

Experience Level: ${experienceLevel}

Provide:
1. Technical Skills (10-12 items)
2. Soft Skills (6-8 items)

Requirements:
- Industry-standard skills
- ATS-friendly keywords
- Relevant to current market demands
- Organized by category

Return as JSON format:
{
  "technical": ["skill1", "skill2", ...],
  "soft": ["skill1", "skill2", ...]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up response to extract JSON
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const skills = JSON.parse(text);

    res.status(200).json({
      success: true,
      data: skills,
      message: 'Skills suggested successfully',
    });
  } catch (error) {
    console.error('AI Skills Suggestion Error:', error);

    // Fallback skills if AI fails
    const fallbackSkills = {
      technical: [
        'JavaScript',
        'React',
        'Node.js',
        'Git',
        'RESTful APIs',
        'Agile',
        'Problem Solving',
      ],
      soft: ['Communication', 'Teamwork', 'Leadership', 'Time Management', 'Adaptability'],
    };

    res.status(200).json({
      success: true,
      data: fallbackSkills,
      message: 'Skills suggested successfully (using defaults)',
    });
  }
};

// @desc    Check ATS compatibility and score
// @route   POST /api/ai/ats-check
// @access  Private
export const checkATSCompatibility = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: 'Resume ID is required',
      });
    }

    const resume = await Resume.findById(resumeId);

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
        message: 'Not authorized',
      });
    }

    // Calculate ATS score
    const atsResult = calculateATSScore(resume, jobDescription);

    // Update resume with ATS data
    resume.atsScore = {
      score: atsResult.score,
      feedback: atsResult.feedback,
      keywords: atsResult.keywords,
      lastChecked: new Date(),
    };

    await resume.save();

    res.status(200).json({
      success: true,
      data: atsResult,
      message: 'ATS compatibility checked successfully',
    });
  } catch (error) {
    console.error('ATS Check Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check ATS compatibility',
      error: error.message,
    });
  }
};

// @desc    Optimize resume for specific job
// @route   POST /api/ai/optimize-resume
// @access  Private
export const optimizeForJob = async (req, res) => {
  try {
    const { resumeId, jobTitle, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Resume ID and job description are required',
      });
    }

    const resume = await Resume.findById(resumeId);

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
        message: 'Not authorized',
      });
    }

    const model = getGeminiModel();

    // Extract current resume text
    const currentSummary = resume.professionalSummary?.text || '';

    const prompt = `Optimize this resume summary for the following job:

Job Title: ${jobTitle}
Job Description: ${jobDescription}

Current Summary: ${currentSummary}

Provide:
1. Optimized professional summary
2. Key skills to highlight (10 items)
3. Action items for improvement (5 items)

Return as JSON:
{
  "summary": "optimized summary text",
  "skills": ["skill1", "skill2", ...],
  "improvements": ["tip1", "tip2", ...]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up response
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const optimization = JSON.parse(text);

    // Save optimization data
    resume.optimization = {
      targetJobTitle: jobTitle,
      targetJobDescription: jobDescription,
      optimizedKeywords: optimization.skills,
      industrySpecific: true,
    };

    await resume.save();

    res.status(200).json({
      success: true,
      data: optimization,
      message: 'Resume optimized successfully',
    });
  } catch (error) {
    console.error('Resume Optimization Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to optimize resume',
      error: error.message,
    });
  }
};

// @desc    Get improvement suggestions
// @route   POST /api/ai/suggestions
// @access  Private
export const getImprovementSuggestions = async (req, res) => {
  try {
    const { resumeId } = req.body;

    const resume = await Resume.findById(resumeId);

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
        message: 'Not authorized',
      });
    }

    const suggestions = [];

    // Check various resume sections
    if (!resume.professionalSummary?.text || resume.professionalSummary.text.length < 50) {
      suggestions.push({
        section: 'Professional Summary',
        priority: 'high',
        suggestion: 'Add a compelling professional summary (100-150 words)',
      });
    }

    if (!resume.experience || resume.experience.length === 0) {
      suggestions.push({
        section: 'Experience',
        priority: 'high',
        suggestion: 'Add your work experience with detailed descriptions',
      });
    }

    const totalSkills =
      (resume.skills?.technical?.length || 0) + (resume.skills?.soft?.length || 0);
    if (totalSkills < 8) {
      suggestions.push({
        section: 'Skills',
        priority: 'medium',
        suggestion: 'Add more relevant skills (aim for 10-15 total skills)',
      });
    }

    if (!resume.projects || resume.projects.length === 0) {
      suggestions.push({
        section: 'Projects',
        priority: 'medium',
        suggestion: 'Showcase your projects to stand out from other candidates',
      });
    }

    if (!resume.certifications || resume.certifications.length === 0) {
      suggestions.push({
        section: 'Certifications',
        priority: 'low',
        suggestion: 'Add relevant certifications to boost credibility',
      });
    }

    if (!resume.personalInfo?.linkedIn && !resume.personalInfo?.github) {
      suggestions.push({
        section: 'Contact Info',
        priority: 'medium',
        suggestion: 'Add LinkedIn or GitHub profile links',
      });
    }

    res.status(200).json({
      success: true,
      data: suggestions,
      message: 'Suggestions generated successfully',
    });
  } catch (error) {
    console.error('Suggestions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate suggestions',
      error: error.message,
    });
  }
};