import crypto from "crypto";

export const generateRandomToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  delete userObj.passwordResetToken;
  delete userObj.passwordResetExpire;
  delete userObj.emailVerificationToken;
  delete userObj.emailVerificationExpire;
  delete userObj.refreshToken;
  return userObj;
};

export const generatePublicLink = (slug) => {
  return `${process.env.CLIENT_URL}/resume/view/${slug}`;
};

export const paginate = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;
  return { skip, limit: limitNum, page: pageNum };
};

export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export const extractTextFromResume = (resume) => {
  let text = "";
  if (resume.personalInfo) {
    text += `${resume.personalInfo.firstName} ${resume.personalInfo.lastName} `;
    text += `${resume.personalInfo.jobTitle || ""} `;
  }
  if (resume.summary) text += `${resume.summary} `;
  if (resume.experience?.length) {
    resume.experience.forEach((exp) => {
      text += `${exp.company} ${exp.position} ${exp.description || ""} `;
      if (exp.achievements) text += exp.achievements.join(" ");
    });
  }
  if (resume.skills?.length) {
    text += resume.skills.map((s) => s.name).join(" ");
  }
  if (resume.education?.length) {
    resume.education.forEach((edu) => {
      text += `${edu.institution} ${edu.degree} ${edu.field || ""} `;
    });
  }
  return text.trim();
};