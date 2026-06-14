export const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean, contemporary design with bold typography",
    preview: "/templates/modern.png",
    tags: ["popular", "tech", "startup"],
    colors: ["#6366f1", "#8b5cf6", "#06b6d4"],
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional layout, perfect for corporate roles",
    preview: "/templates/classic.png",
    tags: ["professional", "corporate", "formal"],
    colors: ["#1e293b", "#334155", "#64748b"],
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Less is more — ultra-clean and focused",
    preview: "/templates/minimal.png",
    tags: ["clean", "simple", "modern"],
    colors: ["#111827", "#374151", "#6b7280"],
  },
  {
    id: "creative",
    name: "Creative",
    description: "Stand out with a vibrant, eye-catching design",
    preview: "/templates/creative.png",
    tags: ["design", "creative", "colorful"],
    colors: ["#ec4899", "#8b5cf6", "#f97316"],
  },
  {
    id: "executive",
    name: "Executive",
    description: "Premium look for senior professionals",
    preview: "/templates/executive.png",
    tags: ["executive", "senior", "premium"],
    colors: ["#0f172a", "#1e3a5f", "#c9a96e"],
  },
  {
    id: "tech",
    name: "Tech",
    description: "Developer-focused with monospace aesthetics",
    preview: "/templates/tech.png",
    tags: ["developer", "engineer", "tech"],
    colors: ["#10b981", "#059669", "#047857"],
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Sophisticated with serif typography",
    preview: "/templates/elegant.png",
    tags: ["elegant", "serif", "luxury"],
    colors: ["#92400e", "#78350f", "#d97706"],
  },
];

export const COLOR_PRESETS = [
  {
    name: "Indigo Dream",
    primary: "#6366f1",
    secondary: "#8b5cf6",
    accent: "#06b6d4",
  },
  {
    name: "Ocean Blue",
    primary: "#0ea5e9",
    secondary: "#0284c7",
    accent: "#06b6d4",
  },
  {
    name: "Forest Green",
    primary: "#10b981",
    secondary: "#059669",
    accent: "#f59e0b",
  },
  {
    name: "Rose Gold",
    primary: "#f43f5e",
    secondary: "#e11d48",
    accent: "#f97316",
  },
  {
    name: "Midnight",
    primary: "#1e293b",
    secondary: "#334155",
    accent: "#6366f1",
  },
  {
    name: "Purple Haze",
    primary: "#7c3aed",
    secondary: "#6d28d9",
    accent: "#ec4899",
  },
  {
    name: "Amber Fire",
    primary: "#f59e0b",
    secondary: "#d97706",
    accent: "#ef4444",
  },
  {
    name: "Teal Storm",
    primary: "#0d9488",
    secondary: "#0f766e",
    accent: "#8b5cf6",
  },
];

export const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner", percentage: 25 },
  { value: "intermediate", label: "Intermediate", percentage: 50 },
  { value: "advanced", label: "Advanced", percentage: 75 },
  { value: "expert", label: "Expert", percentage: 100 },
];

export const LANGUAGE_PROFICIENCY = [
  { value: "basic", label: "Basic" },
  { value: "conversational", label: "Conversational" },
  { value: "proficient", label: "Proficient" },
  { value: "fluent", label: "Fluent" },
  { value: "native", label: "Native" },
];

export const SECTION_ICONS = {
  summary: "📝",
  experience: "💼",
  education: "🎓",
  skills: "⚡",
  projects: "🚀",
  certifications: "🏆",
  languages: "🌍",
  awards: "🥇",
  volunteerWork: "❤️",
};

export const ATS_SCORE_COLORS = {
  excellent: { color: "#10b981", bg: "#d1fae5", label: "Excellent" },
  good: { color: "#3b82f6", bg: "#dbeafe", label: "Good" },
  fair: { color: "#f59e0b", bg: "#fef3c7", label: "Fair" },
  poor: { color: "#ef4444", bg: "#fee2e2", label: "Needs Work" },
};

export const getATSCategory = (score) => {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "fair";
  return "poor";
};

export const FONT_OPTIONS = [
  { value: "Inter", label: "Inter (Modern)" },
  { value: "Playfair Display", label: "Playfair Display (Elegant)" },
  { value: "Georgia", label: "Georgia (Classic)" },
  { value: "Roboto", label: "Roboto (Clean)" },
  { value: "Merriweather", label: "Merriweather (Professional)" },
];

export const FONT_SIZES = [
  { value: "small", label: "Small", base: "11px" },
  { value: "medium", label: "Medium", base: "12px" },
  { value: "large", label: "Large", base: "13px" },
];

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh-token",
    PROFILE: "/auth/profile",
    CHANGE_PASSWORD: "/auth/change-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  RESUMES: {
    BASE: "/resumes",
    SINGLE: (id) => `/resumes/${id}`,
    DUPLICATE: (id) => `/resumes/${id}/duplicate`,
    ARCHIVE: (id) => `/resumes/${id}/archive`,
    DOWNLOAD: (id) => `/resumes/${id}/download`,
    PUBLIC: (slug) => `/resumes/public/${slug}`,
  },
  AI: {
    SUMMARY: "/ai/generate-summary",
    ENHANCE: "/ai/enhance-experience",
    SKILLS: "/ai/suggest-skills",
    ATS: "/ai/ats-score",
    CUSTOMIZE: "/ai/customize-for-job",
    KEYWORDS: "/ai/optimize-keywords",
    PROJECT: "/ai/generate-project",
    TIPS: "/ai/improvement-tips",
  },
};

export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 4000,
  LONG: 6000,
};