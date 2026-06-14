import api from "./api.js";

export const resumeService = {
  getResumes: async (params = {}) => {
    try {
      const response = await api.get("/resumes", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching resumes:", error);
      throw error;
    }
  },

  getResume: async (id) => {
    // Enhanced validation
    if (!id || id === "undefined" || id === "null" || id === "new") {
      throw new Error("Invalid resume ID provided");
    }
    
    try {
      const response = await api.get(`/resumes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching resume ${id}:`, error);
      throw error;
    }
  },

  createResume: async (resumeData) => {
    try {
      const response = await api.post("/resumes", resumeData);
      return response.data;
    } catch (error) {
      console.error("Error creating resume:", error);
      throw error;
    }
  },

  updateResume: async (id, resumeData) => {
    if (!id || id === "undefined" || id === "null" || id === "new") {
      throw new Error("Invalid resume ID for update");
    }
    
    try {
      const response = await api.put(`/resumes/${id}`, resumeData);
      return response.data;
    } catch (error) {
      console.error(`Error updating resume ${id}:`, error);
      throw error;
    }
  },

  deleteResume: async (id) => {
    if (!id || id === "undefined" || id === "null") {
      throw new Error("Invalid resume ID for deletion");
    }
    
    try {
      const response = await api.delete(`/resumes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting resume ${id}:`, error);
      throw error;
    }
  },

  duplicateResume: async (id) => {
    if (!id || id === "undefined" || id === "null") {
      throw new Error("Invalid resume ID for duplication");
    }
    
    try {
      const response = await api.post(`/resumes/${id}/duplicate`);
      return response.data;
    } catch (error) {
      console.error(`Error duplicating resume ${id}:`, error);
      throw error;
    }
  },

  toggleArchive: async (id) => {
    if (!id || id === "undefined" || id === "null") {
      throw new Error("Invalid resume ID for archive operation");
    }
    
    try {
      const response = await api.patch(`/resumes/${id}/archive`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling archive for resume ${id}:`, error);
      throw error;
    }
  },

  trackDownload: async (id) => {
    if (!id || id === "undefined" || id === "null") {
      console.warn("Attempted to track download with invalid ID");
      return;
    }
    
    try {
      const response = await api.post(`/resumes/${id}/download`);
      return response.data;
    } catch (error) {
      console.error(`Error tracking download for resume ${id}:`, error);
      // Don't throw - this is a non-critical operation
    }
  },

  getPublicResume: async (slug) => {
    if (!slug) {
      throw new Error("Invalid resume slug");
    }
    
    try {
      const response = await api.get(`/resumes/public/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching public resume ${slug}:`, error);
      throw error;
    }
  },
};

export default resumeService;