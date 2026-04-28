import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

class AIService {
  constructor() {
    this.genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
    this.openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
  }

  async generateProfessionalSummary(jobTitle, experience, skills) {
    const prompt = `Generate a professional resume summary for a ${jobTitle} with ${experience} years of experience. 
    Key skills: ${skills.join(', ')}. 
    Make it compelling, achievement-oriented, and ATS-friendly. Keep it to 3-4 sentences.`;

    return await this.getAIResponse(prompt);
  }

  async enhanceExperienceDescription(jobTitle, responsibilities) {
    const prompt = `Enhance these job responsibilities for a ${jobTitle} position to make them more impactful and achievement-oriented. 
    Use action verbs, quantify achievements where possible, and focus on results.
    
    Original: ${responsibilities}
    
    Provide 3-4 bullet points with enhanced versions:`;

    return await this.getAIResponse(prompt);
  }

  async suggestSkills(jobRole, experience) {
    const prompt = `Suggest 8-10 relevant skills for a ${jobRole} with ${experience} years of experience. 
    Include both technical and soft skills. Format as a JSON array.`;

    const response = await this.getAIResponse(prompt);
    try {
      return JSON.parse(response);
    } catch {
      return response.split(',').map(s => s.trim());
    }
  }

  async analyzeResumeATS(resumeData, jobDescription) {
    const prompt = `Analyze this resume for ATS compatibility and provide:
    1. Overall score (0-100)
    2. Missing keywords (from job description)
    3. Improvement suggestions (top 5)
    4. Formatting issues
    5. Keyword density analysis
    
    Resume: ${JSON.stringify(resumeData)}
    Job Description: ${jobDescription}
    
    Return as JSON object with keys: score, missingKeywords, suggestions, formattingIssues, keywordDensity`;

    const response = await this.getAIResponse(prompt);
    try {
      return JSON.parse(response);
    } catch {
      return {
        score: 75,
        missingKeywords: ['leadership', 'project management'],
        suggestions: ['Add more quantifiable achievements', 'Include relevant keywords'],
        formattingIssues: ['Consider standard section headings'],
        keywordDensity: { low: 3, medium: 5, high: 2 }
      };
    }
  }

  async customizeResumeForJob(resumeData, jobDescription, companyName) {
    const prompt = `Customize this resume for a position at ${companyName}. 
    Job Description: ${jobDescription}
    Current Resume: ${JSON.stringify(resumeData)}
    
    Provide customized version focusing on relevant experience, keywords, and achievements that align with the job requirements.
    Return the customized sections: summary, experience highlights, and skills.`;

    return await this.getAIResponse(prompt);
  }

  async getResumeScore(resumeData) {
    const prompt = `Score this resume (0-100) based on:
    - Content quality (40%)
    - Formatting (20%)
    - Keyword optimization (20%)
    - Achievement focus (20%)
    
    Resume: ${JSON.stringify(resumeData)}
    
    Return JSON with: totalScore, breakdown, detailedFeedback, improvementTips`;

    const response = await this.getAIResponse(prompt);
    try {
      return JSON.parse(response);
    } catch {
      return {
        totalScore: 82,
        breakdown: { content: 85, formatting: 90, keywords: 75, achievements: 80 },
        detailedFeedback: ['Good structure', 'Add more metrics'],
        improvementTips: ['Quantify achievements with numbers', 'Add industry keywords']
      };
    }
  }

  async optimizeKeywords(resumeData, targetRole) {
    const prompt = `Optimize keywords for a ${targetRole} resume.
    Current resume: ${JSON.stringify(resumeData)}
    
    Suggest 10 most important keywords to add and where to place them.
    Return as JSON with keywords array and placement suggestions.`;

    const response = await this.getAIResponse(prompt);
    try {
      return JSON.parse(response);
    } catch {
      return {
        keywords: ['strategic planning', 'data analysis', 'team leadership'],
        placement: ['Add to summary section', 'Include in experience bullet points']
      };
    }
  }

  async getAIResponse(prompt) {
    try {
      // Try Gemini first if available
      if (this.genAI) {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        return result.response.text();
      }
      
      // Fallback to OpenAI
      if (this.openai) {
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        });
        return completion.choices[0].message.content;
      }
      
      throw new Error('No AI service configured');
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackResponse(prompt);
    }
  }

  getFallbackResponse(prompt) {
    if (prompt.includes('professional summary')) {
      return "Results-driven professional with proven track record of success. Strong analytical and problem-solving skills with ability to drive results. Excellent communicator and team player committed to continuous improvement and excellence.";
    }
    if (prompt.includes('suggest skills')) {
      return JSON.stringify(['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration', 'Project Management', 'Data Analysis', 'Strategic Planning', 'Customer Focus']);
    }
    return "Enhanced content based on industry best practices. Focus on quantifiable achievements and specific outcomes.";
  }
}

export default new AIService();