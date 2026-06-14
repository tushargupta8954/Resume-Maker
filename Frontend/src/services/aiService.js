import api from "./api.js";

export const aiService = {
  generateSummary: async (data) => {
    const response = await api.post("/ai/generate-summary", data);
    return response.data;
  },

  enhanceExperience: async (data) => {
    const response = await api.post("/ai/enhance-experience", data);
    return response.data;
  },

  suggestSkills: async (data) => {
    const response = await api.post("/ai/suggest-skills", data);
    return response.data;
  },

  calculateATSScore: async (data) => {
    const response = await api.post("/ai/ats-score", data);
    return response.data;
  },

  customizeForJob: async (data) => {
    const response = await api.post("/ai/customize-for-job", data);
    return response.data;
  },

  optimizeKeywords: async (data) => {
    const response = await api.post("/ai/optimize-keywords", data);
    return response.data;
  },

  generateProjectDescription: async (data) => {
    const response = await api.post("/ai/generate-project", data);
    return response.data;
  },

  getImprovementTips: async (data) => {
    const response = await api.post("/ai/improvement-tips", data);
    return response.data;
  },
};

export default aiService;