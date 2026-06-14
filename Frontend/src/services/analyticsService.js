import api from "./api.js";

export const analyticsService = {
  getDashboardAnalytics: async (days = 30) => {
    const response = await api.get("/analytics/dashboard", {
      params: { days },
    });
    return response.data;
  },

  getResumeAnalytics: async (resumeId, days = 30) => {
    const response = await api.get(`/analytics/resume/${resumeId}`, {
      params: { days },
    });
    return response.data;
  },

  trackEvent: async (eventData) => {
    const response = await api.post("/analytics/track", eventData);
    return response.data;
  },
};

export default analyticsService;