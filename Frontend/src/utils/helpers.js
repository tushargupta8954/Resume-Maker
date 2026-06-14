import { v4 as uuidv4 } from "uuid";

export const generateId = () => uuidv4();

export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

export const formatDateRange = (startDate, endDate, isCurrent = false) => {
  const start = formatDate(startDate);
  const end = isCurrent ? "Present" : formatDate(endDate);
  if (!start) return "";
  return `${start} – ${end}`;
};

export const truncate = (str, length = 100) => {
  if (!str) return "";
  return str.length > length ? `${str.substring(0, length)}...` : str;
};

export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getInitials = (firstName = "", lastName = "") => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const getATSColor = (score) => {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#3b82f6";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
};

export const getATSLabel = (score) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Work";
};

export const calculateCompletionPercentage = (resumeData) => {
  const checks = [
    resumeData?.personalInfo?.firstName,
    resumeData?.personalInfo?.email,
    resumeData?.personalInfo?.phone,
    resumeData?.summary,
    resumeData?.experience?.length > 0,
    resumeData?.education?.length > 0,
    resumeData?.skills?.length > 0,
    resumeData?.projects?.length > 0,
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
};

export const createEmptyExperience = () => ({
  id: generateId(),
  company: "",
  position: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrentRole: false,
  description: "",
  achievements: [],
  technologies: [],
  aiEnhanced: false,
});

export const createEmptyEducation = () => ({
  id: generateId(),
  institution: "",
  degree: "",
  field: "",
  location: "",
  startDate: "",
  endDate: "",
  gpa: "",
  honors: "",
  relevantCourses: [],
});

export const createEmptySkill = () => ({
  id: generateId(),
  name: "",
  level: "intermediate",
  category: "Technical",
  yearsOfExperience: 0,
});

export const createEmptyProject = () => ({
  id: generateId(),
  name: "",
  description: "",
  technologies: [],
  liveUrl: "",
  githubUrl: "",
  startDate: "",
  endDate: "",
  highlights: [],
  imageUrl: "",
  aiEnhanced: false,
});

export const createEmptyCertification = () => ({
  id: generateId(),
  name: "",
  issuer: "",
  date: "",
  expiryDate: "",
  credentialId: "",
  url: "",
});

export const createEmptyLanguage = () => ({
  id: generateId(),
  name: "",
  proficiency: "proficient",
});

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};