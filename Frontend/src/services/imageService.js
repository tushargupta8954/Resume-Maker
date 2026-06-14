import api from "./api.js";

export const imageService = {
  uploadProfileImage: async (file, removeBackground = true) => {
    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("removeBackground", removeBackground);

    const response = await api.post("/images/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    });
    return response.data;
  },

  deleteProfileImage: async () => {
    const response = await api.delete("/images/profile");
    return response.data;
  },

  uploadResumeAsset: async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post("/images/asset", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 30000,
    });
    return response.data;
  },
};

export default imageService;