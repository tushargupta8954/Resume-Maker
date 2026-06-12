import natural from 'natural';

const { TfIdf, PorterStemmer, WordTokenizer } = natural;

export const calculateATSScore = (resume, jobDescription = '') => {
  const tokenizer = new WordTokenizer();
  const tfidf = new TfIdf();

  // Extract text content from resume
  const resumeText = extractResumeText(resume);

  // Common ATS keywords and criteria
  const atsKeywords = [
    'experience',
    'education',
    'skills',
    'achievements',
    'certifications',
    'projects',
    'leadership',
    'management',
    'communication',
    'teamwork',
    'analysis',
    'development',
    'design',
    'implementation',
  ];

  let score = 0;
  const feedback = [];
  const matched = [];
  const missing = [];

  // 1. Contact Information (10 points)
  if (resume.personalInfo?.email && resume.personalInfo?.phone) {
    score += 10;
  } else {
    feedback.push('Add complete contact information (email and phone)');
  }

  // 2. Professional Summary (15 points)
  if (resume.professionalSummary?.text && resume.professionalSummary.text.length > 50) {
    score += 15;
  } else {
    feedback.push('Add a professional summary (at least 50 characters)');
  }

  // 3. Work Experience (25 points)
  if (resume.experience && resume.experience.length > 0) {
    score += 15;
    if (resume.experience.length >= 2) score += 5;
    if (resume.experience.some((exp) => exp.achievements && exp.achievements.length > 0)) {
      score += 5;
    } else {
      feedback.push('Add measurable achievements to your work experience');
    }
  } else {
    feedback.push('Add work experience details');
  }

  // 4. Education (15 points)
  if (resume.education && resume.education.length > 0) {
    score += 15;
  } else {
    feedback.push('Add education details');
  }

  // 5. Skills (20 points)
  const totalSkills =
    (resume.skills?.technical?.length || 0) + (resume.skills?.soft?.length || 0);

  if (totalSkills >= 8) {
    score += 20;
  } else if (totalSkills >= 5) {
    score += 15;
  } else if (totalSkills >= 3) {
    score += 10;
  } else {
    feedback.push('Add more skills (aim for at least 8 skills)');
  }

  // 6. Keyword Matching (15 points)
  const resumeKeywords = tokenizer.tokenize(resumeText.toLowerCase());
  const jobKeywords = jobDescription
    ? tokenizer.tokenize(jobDescription.toLowerCase())
    : atsKeywords;

  let keywordMatchCount = 0;
  jobKeywords.forEach((keyword) => {
    if (resumeKeywords.includes(keyword)) {
      keywordMatchCount++;
      if (!matched.includes(keyword)) {
        matched.push(keyword);
      }
    } else if (atsKeywords.includes(keyword)) {
      if (!missing.includes(keyword)) {
        missing.push(keyword);
      }
    }
  });

  const keywordScore = Math.min((keywordMatchCount / jobKeywords.length) * 15, 15);
  score += keywordScore;

  if (keywordScore < 10) {
    feedback.push('Optimize resume with more relevant keywords from the job description');
  }

  // 7. Formatting & Structure (Bonus)
  if (resume.projects && resume.projects.length > 0) {
    score += 2;
  }
  if (resume.certifications && resume.certifications.length > 0) {
    score += 2;
  }
  if (resume.personalInfo?.linkedIn || resume.personalInfo?.github) {
    score += 1;
  }

  // General feedback
  if (score >= 90) {
    feedback.unshift('Excellent! Your resume is well-optimized for ATS');
  } else if (score >= 75) {
    feedback.unshift('Good! Your resume has strong ATS compatibility');
  } else if (score >= 60) {
    feedback.unshift('Fair. Consider adding more details to improve ATS score');
  } else {
    feedback.unshift('Your resume needs significant improvement for ATS compatibility');
  }

  return {
    score: Math.min(Math.round(score), 100),
    feedback,
    keywords: {
      matched: matched.slice(0, 20),
      missing: missing.slice(0, 10),
    },
  };
};

const extractResumeText = (resume) => {
  let text = '';

  // Personal info
  if (resume.personalInfo) {
    text += Object.values(resume.personalInfo).join(' ') + ' ';
  }

  // Summary
  if (resume.professionalSummary?.text) {
    text += resume.professionalSummary.text + ' ';
  }

  // Experience
  if (resume.experience) {
    resume.experience.forEach((exp) => {
      text += `${exp.jobTitle} ${exp.company} ${exp.description || ''} `;
      if (exp.achievements) {
        text += exp.achievements.join(' ') + ' ';
      }
    });
  }

  // Education
  if (resume.education) {
    resume.education.forEach((edu) => {
      text += `${edu.degree} ${edu.institution} `;
    });
  }

  // Skills
  if (resume.skills) {
    text += (resume.skills.technical || []).join(' ') + ' ';
    text += (resume.skills.soft || []).join(' ') + ' ';
  }

  // Projects
  if (resume.projects) {
    resume.projects.forEach((proj) => {
      text += `${proj.title} ${proj.description || ''} `;
      if (proj.technologies) {
        text += proj.technologies.join(' ') + ' ';
      }
    });
  }

  return text;
};

export const optimizeKeywords = (resumeText, jobDescription) => {
  const tokenizer = new WordTokenizer();
  const tfidf = new TfIdf();

  tfidf.addDocument(resumeText);
  tfidf.addDocument(jobDescription);

  const keywords = [];
  const terms = tokenizer.tokenize(jobDescription.toLowerCase());

  terms.forEach((term) => {
    const score = tfidf.tfidf(term, 1);
    if (score > 0.5) {
      keywords.push(term);
    }
  });

  return keywords.slice(0, 20);
};