import { GoogleGenerativeAI } from "@google/generative-ai";
import Resume from "../models/Resume.js";
import Analytics from "../models/Analytics.js";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini with error handling
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

// Helper function to extract text from resume
const extractTextFromResume = (resume) => {
  if (!resume) return "";
  
  let text = "";
  
  // Add personal info
  if (resume.personalInfo) {
    const { fullName, email, phone, location, linkedin } = resume.personalInfo;
    text += `${fullName || ""} ${email || ""} ${phone || ""} ${location || ""} ${linkedin || ""} `;
  }
  
  // Add professional summary
  if (resume.summary) {
    text += resume.summary + " ";
  }
  
  // Add work experience
  if (resume.experience && Array.isArray(resume.experience)) {
    resume.experience.forEach(exp => {
      text += `${exp.position || ""} at ${exp.company || ""} ${exp.description || ""} `;
      if (exp.achievements && Array.isArray(exp.achievements)) {
        text += exp.achievements.join(" ") + " ";
      }
    });
  }
  
  // Add education
  if (resume.education && Array.isArray(resume.education)) {
    resume.education.forEach(edu => {
      text += `${edu.degree || ""} in ${edu.field || ""} from ${edu.institution || ""} `;
    });
  }
  
  // Add skills
  if (resume.skills && Array.isArray(resume.skills)) {
    text += resume.skills.join(" ") + " ";
  }
  
  // Add projects
  if (resume.projects && Array.isArray(resume.projects)) {
    resume.projects.forEach(project => {
      text += `${project.name || ""} ${project.description || ""} `;
      if (project.technologies && Array.isArray(project.technologies)) {
        text += project.technologies.join(" ") + " ";
      }
    });
  }
  
  return text.trim();
};

const callGemini = async (prompt, maxRetries = 2) => {
  let lastError;
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API key is not configured");
      }
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text || text.trim().length === 0) {
        throw new Error("Empty response from Gemini API");
      }
      
      return text;
    } catch (error) {
      lastError = error;
      console.error(`Gemini API attempt ${i + 1} failed:`, error.message);

      if (error.message?.includes("[429 Too Many Requests]")) {
        const quotaError = new Error(
          "Gemini quota exceeded. Please wait, enable billing, or set GEMINI_MODEL to a model with available quota."
        );
        quotaError.statusCode = 429;
        throw quotaError;
      }
      
      if (error.message?.includes("[404 Not Found]")) {
        const modelError = new Error(
          `Gemini model "${GEMINI_MODEL}" is not available for this API key. Set GEMINI_MODEL to a supported model.`
        );
        modelError.statusCode = 502;
        throw modelError;
      }
      
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      }
    }
  }
  
  throw new Error(`Gemini AI failed after ${maxRetries + 1} attempts: ${lastError?.message || "Unknown error"}`);
};

// Helper to safely parse JSON from Gemini response
const safeParseJSON = (rawResponse, fallback = {}) => {
  try {
    // Try to extract JSON from markdown code blocks
    let jsonStr = rawResponse;
    const codeBlockMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1];
    }
    
    // Try to find JSON object in the response
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return fallback;
  } catch (error) {
    console.error("JSON parsing error:", error.message);
    return fallback;
  }
};

// @desc    Generate professional summary
// @route   POST /api/ai/generate-summary
// @access  Private
export const generateSummary = async (req, res, next) => {
  try {
    const { resumeId, jobTitle, experience, skills, tone = "professional" } = req.body;

    // Validate input
    if (!resumeId && !jobTitle && !skills) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least resumeId, jobTitle, or skills"
      });
    }

    const prompt = `You are an expert resume writer. Generate a compelling, ATS-optimized professional summary for a resume.

Job Title: ${jobTitle || "Professional"}
Years of Experience: ${experience || "Not specified"}
Key Skills: ${Array.isArray(skills) ? skills.join(", ") : skills || "Not specified"}
Tone: ${tone}

Requirements:
- Write 3-4 impactful sentences
- Start with a strong action word or professional title
- Include quantifiable achievements if possible
- Make it ATS-friendly with relevant keywords
- Keep it under 100 words
- Make it compelling and unique
- Use first person but without "I"

Return ONLY the summary text, no explanation or formatting.`;

    const summary = await callGemini(prompt);

    if (!summary || summary.trim().length === 0) {
      throw new Error("Generated summary is empty");
    }

    if (resumeId) {
      const updatedResume = await Resume.findOneAndUpdate(
        { _id: resumeId, user: req.user._id },
        {
          summary: summary.trim(),
          aiSummaryGenerated: true,
          lastAIInteraction: new Date(),
          $inc: { aiEnhancements: 1 },
        },
        { new: true } // Return updated document
      );

      if (!updatedResume) {
        return res.status(404).json({
          success: false,
          message: "Resume not found or you don't have permission"
        });
      }

      await Analytics.create({
        user: req.user._id,
        resume: resumeId,
        eventType: "ai_summary",
        metadata: { jobRole: jobTitle || "Not specified" },
      });
    }

    res.status(200).json({
      success: true,
      message: "Professional summary generated! ✨",
      data: { summary: summary.trim() },
    });
  } catch (error) {
    console.error("Generate summary error:", error);
    next(error);
  }
};

// @desc    Enhance experience description
// @route   POST /api/ai/enhance-experience
// @access  Private
export const enhanceExperience = async (req, res, next) => {
  try {
    const { description, position, company, achievements = [] } = req.body;

    if (!description && achievements.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide description or achievements to enhance"
      });
    }

    const prompt = `You are an expert resume writer specializing in transforming work experience into powerful, ATS-optimized bullet points.

Position: ${position || "Position"}
Company: ${company || "Company"}
Current Description: ${description || "Not provided"}
${achievements.length ? `Current Achievements: ${achievements.join("\n")}` : ""}

Transform this into 4-6 powerful bullet points that:
- Start with strong action verbs (Led, Developed, Implemented, Increased, etc.)
- Include specific metrics and numbers where inferred or appropriate
- Follow the STAR method (Situation, Task, Action, Result)
- Are ATS-optimized with industry keywords
- Quantify impact wherever possible
- Are concise but impactful (1-2 lines each)

Return ONLY a JSON object with this exact structure (no markdown formatting):
{
  "description": "Enhanced paragraph description",
  "achievements": ["bullet point 1", "bullet point 2", "bullet point 3", "bullet point 4"]
}`;

    const rawResponse = await callGemini(prompt);
    
    let enhanced = safeParseJSON(rawResponse, { 
      description: rawResponse.trim(), 
      achievements: [] 
    });

    // Ensure achievements is an array
    if (!Array.isArray(enhanced.achievements)) {
      enhanced.achievements = [];
    }

    res.status(200).json({
      success: true,
      message: "Experience enhanced with AI! 🚀",
      data: { enhanced },
    });
  } catch (error) {
    console.error("Enhance experience error:", error);
    next(error);
  }
};

// @desc    Suggest skills based on job role
// @route   POST /api/ai/suggest-skills
// @access  Private
export const suggestSkills = async (req, res, next) => {
  try {
    const { jobRole, currentSkills = [], experienceLevel = "mid-level" } = req.body;

    if (!jobRole) {
      return res.status(400).json({
        success: false,
        message: "Job role is required"
      });
    }

    const prompt = `You are a career advisor and skills expert. Suggest relevant skills for a resume.

Job Role: ${jobRole}
Experience Level: ${experienceLevel}
Current Skills: ${currentSkills.join(", ")}

Provide a comprehensive list of skills categorized by type. Include:
- Technical Skills (hard skills specific to the role)
- Soft Skills (interpersonal and transferable skills)
- Tools & Technologies
- Industry-Specific Skills

Return ONLY a JSON object with this exact structure (no markdown formatting):
{
  "technical": ["skill1", "skill2", "skill3"],
  "soft": ["skill1", "skill2", "skill3"],
  "tools": ["tool1", "tool2", "tool3"],
  "industry": ["skill1", "skill2", "skill3"],
  "trending": ["emerging skill1", "emerging skill2"]
}

Suggest 5-8 skills per category. Don't include already listed current skills.`;

    const rawResponse = await callGemini(prompt);
    const skills = safeParseJSON(rawResponse, {
      technical: [],
      soft: [],
      tools: [],
      industry: [],
      trending: []
    });

    res.status(200).json({
      success: true,
      message: "Skills suggested based on your role! 💡",
      data: { skills },
    });
  } catch (error) {
    console.error("Suggest skills error:", error);
    next(error);
  }
};

// @desc    Calculate ATS score and get improvements
// @route   POST /api/ai/ats-score
// @access  Private
export const calculateATSScore = async (req, res, next) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required"
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    const resumeText = extractTextFromResume(resume);

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Resume has no content to analyze. Please add some information first."
      });
    }

    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. Analyze this resume for ATS compatibility.

RESUME CONTENT:
${resumeText.substring(0, 3000)} ${jobDescription ? `\n\nJOB DESCRIPTION:\n${jobDescription.substring(0, 2000)}` : ""}

Analyze and provide detailed scoring. Return ONLY a valid JSON object with this exact structure (no markdown formatting):
{
  "overall": 75,
  "sections": {
    "keywords": 70,
    "formatting": 85,
    "readability": 80,
    "completeness": 75,
    "experience": 70
  },
  "improvements": [
    "Add more quantifiable achievements with specific metrics",
    "Include relevant keywords from the job description",
    "Strengthen your professional summary"
  ],
  "keywords": {
    "found": ["project management", "leadership", "agile"],
    "missing": ["stakeholder management", "budget planning", "risk assessment"],
    "density": 3.5
  },
  "detailedFeedback": {
    "strengths": ["Clear structure", "Good use of action verbs"],
    "weaknesses": ["Missing metrics", "Keywords need optimization"]
  }
}

All scores must be integers between 0-100. Provide 5-8 specific, actionable improvements.`;

    const rawResponse = await callGemini(prompt);
    const atsData = safeParseJSON(rawResponse, null);

    if (!atsData || typeof atsData.overall !== 'number') {
      // Provide fallback data if parsing fails
      const fallbackData = {
        overall: 50,
        sections: {
          keywords: 50,
          formatting: 50,
          readability: 50,
          completeness: 50,
          experience: 50
        },
        improvements: ["Unable to analyze properly. Please ensure resume has sufficient content."],
        keywords: { found: [], missing: [], density: 0 },
        detailedFeedback: { strengths: [], weaknesses: [] }
      };
      
      await Resume.findByIdAndUpdate(resumeId, {
        atsScore: {
          ...fallbackData,
          lastChecked: new Date(),
          jobDescription: jobDescription || "",
        },
        lastAIInteraction: new Date(),
      });
      
      return res.status(200).json({
        success: true,
        message: "ATS analysis complete (with fallback data)! 📊",
        data: { atsScore: fallbackData },
      });
    }

    // Update resume ATS score
    const prevScore = resume.atsScore?.overall || 0;
    await Resume.findByIdAndUpdate(resumeId, {
      atsScore: {
        ...atsData,
        lastChecked: new Date(),
        jobDescription: jobDescription || "",
      },
      lastAIInteraction: new Date(),
    });

    await Analytics.create({
      user: req.user._id,
      resume: resumeId,
      eventType: "ats_check",
      metadata: {
        atsScoreBefore: prevScore,
        atsScoreAfter: atsData.overall,
      },
    });

    res.status(200).json({
      success: true,
      message: "ATS analysis complete! 📊",
      data: { atsScore: atsData },
    });
  } catch (error) {
    console.error("ATS score error:", error);
    next(error);
  }
};

// @desc    Customize resume for job description
// @route   POST /api/ai/customize-for-job
// @access  Private
export const customizeForJob = async (req, res, next) => {
  try {
    const { resumeId, jobDescription, jobTitle, companyName } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Resume ID and job description are required"
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    const resumeText = extractTextFromResume(resume);

    const prompt = `You are an expert resume consultant. Analyze the resume and job description to provide specific customization suggestions.

CURRENT RESUME:
${resumeText.substring(0, 3000)}

JOB TITLE: ${jobTitle || "Not specified"}
COMPANY: ${companyName || "Not specified"}
JOB DESCRIPTION:
${jobDescription.substring(0, 2000)}

Provide specific, actionable customization recommendations. Return ONLY a valid JSON with this structure (no markdown):
{
  "summaryRewrite": "Rewritten summary tailored to this specific job...",
  "keywordsToAdd": ["keyword1", "keyword2", "keyword3"],
  "skillsToHighlight": ["skill1", "skill2", "skill3"],
  "experienceAdjustments": [
    {
      "index": 0,
      "suggestion": "Rewrite this experience to emphasize..."
    }
  ],
  "missingElements": ["What's missing from resume", "Another gap"],
  "customizationScore": 72,
  "overallMatch": "This resume is a 72% match for this position. Key areas to improve...",
  "priorityActions": ["Most important action", "Second priority", "Third priority"]
}`;

    const rawResponse = await callGemini(prompt);
    const customization = safeParseJSON(rawResponse, { 
      overallMatch: rawResponse.substring(0, 500) 
    });

    // Update resume with target job info
    await Resume.findByIdAndUpdate(resumeId, {
      targetJobRole: jobTitle,
      targetJobDescription: jobDescription,
      lastAIInteraction: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Resume customization analysis complete! 🎯",
      data: { customization },
    });
  } catch (error) {
    console.error("Customize job error:", error);
    next(error);
  }
};

// Export remaining functions (optimizeKeywords, generateProjectDescription, getImprovementTips)
// Similar fixes would be applied to these functions...

export const optimizeKeywords = async (req, res, next) => {
  try {
    const { resumeId, industry } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required"
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    const resumeText = extractTextFromResume(resume);

    const prompt = `You are an SEO and ATS keyword optimization expert for resumes.

RESUME: ${resumeText.substring(0, 3000)}
INDUSTRY: ${industry || "General"}

Analyze and provide keyword optimization. Return ONLY valid JSON with this structure (no markdown):
{
  "currentKeywords": ["existing strong keyword1", "existing keyword2"],
  "suggestedKeywords": [
    {"keyword": "project management", "priority": "high", "context": "Add to summary and experience"},
    {"keyword": "agile methodology", "priority": "medium", "context": "Add to skills section"}
  ],
  "keywordDensity": 2.8,
  "optimizedPhrases": [
    "Instead of 'managed team', use 'led cross-functional team of 10 engineers'",
    "Replace 'worked on projects' with 'delivered 5 high-impact projects'"
  ],
  "industryKeywords": ["term1", "term2", "term3"],
  "actionVerbs": ["Led", "Implemented", "Developed", "Optimized", "Delivered"]
}`;

    const rawResponse = await callGemini(prompt);
    const optimization = safeParseJSON(rawResponse, {});

    res.status(200).json({
      success: true,
      message: "Keyword optimization analysis complete! 🔑",
      data: { optimization },
    });
  } catch (error) {
    console.error("Optimize keywords error:", error);
    next(error);
  }
};

export const generateProjectDescription = async (req, res, next) => {
  try {
    const { projectName, technologies, role, duration } = req.body;

    if (!projectName) {
      return res.status(400).json({
        success: false,
        message: "Project name is required"
      });
    }

    const prompt = `Generate a compelling project description for a resume.

Project Name: ${projectName}
Technologies Used: ${Array.isArray(technologies) ? technologies.join(", ") : technologies || "Not specified"}
Your Role: ${role || "Developer"}
Duration: ${duration || "Not specified"}

Create:
1. A 2-3 sentence project description
2. 3-4 bullet points highlighting key achievements and technical aspects

Return ONLY valid JSON with this structure (no markdown):
{
  "description": "Built a [type of application] using [technologies] that [main purpose/impact]...",
  "highlights": [
    "Implemented [feature] resulting in [specific benefit]",
    "Developed [component] using [technology] achieving [result]"
  ]
}`;

    const rawResponse = await callGemini(prompt);
    const projectData = safeParseJSON(rawResponse, { 
      description: rawResponse,
      highlights: [] 
    });

    res.status(200).json({
      success: true,
      message: "Project description generated! 🛠️",
      data: { project: projectData },
    });
  } catch (error) {
    console.error("Generate project error:", error);
    next(error);
  }
};

export const getImprovementTips = async (req, res, next) => {
  try {
    const { resumeId } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required"
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ 
        success: false, 
        message: "Resume not found." 
      });
    }

    const resumeText = extractTextFromResume(resume);
    const completion = resume.completionPercentage || 0;

    const prompt = `You are a professional resume coach. Analyze this resume and provide specific improvement tips.

RESUME CONTENT: ${resumeText.substring(0, 3000)}
COMPLETION: ${completion}%
TEMPLATE: ${resume.template || "Standard"}
ATS SCORE: ${resume.atsScore?.overall || "Not analyzed"}

Provide personalized, actionable improvement tips. Return ONLY valid JSON with this structure (no markdown):
{
  "quickWins": [
    {"tip": "Add your LinkedIn URL", "impact": "high", "effort": "low"},
    {"tip": "Quantify your achievements", "impact": "high", "effort": "medium"}
  ],
  "contentImprovements": [
    "Strengthen action verbs in experience section",
    "Add a more compelling professional summary"
  ],
  "formatImprovements": [
    "Consider adding a skills section",
    "Break long paragraphs into bullet points"
  ],
  "missingInformation": ["Phone number", "GitHub profile", "Portfolio link"],
  "priorityScore": 85,
  "estimatedImprovement": "Following these tips could increase your ATS score by 15-20 points",
  "nextStep": "The most impactful next step is to..."
}`;

    const rawResponse = await callGemini(prompt);
    const tips = safeParseJSON(rawResponse, { 
      contentImprovements: [rawResponse.substring(0, 200)],
      quickWins: []
    });

    res.status(200).json({
      success: true,
      message: "Improvement tips generated! 💡",
      data: { tips },
    });
  } catch (error) {
    console.error("Improvement tips error:", error);
    next(error);
  }
};
