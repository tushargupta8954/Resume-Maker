import API from './api';

// Get user profile
export const getUserProfile = async () => {
  const response = await API.get('/users/profile');
  return response.data;
};

// Update user profile
export const updateUserProfile = async (data) => {
  const response = await API.put('/users/profile', data);
  return response.data;
};

// Upload profile picture
export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await API.post('/users/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Delete profile picture
export const deleteProfilePicture = async () => {
  const response = await API.delete('/users/profile-picture');
  return response.data;
};

// Get user stats
export const getUserStats = async () => {
  const response = await API.get('/users/stats');
  return response.data;
};

// Get user analytics
export const getUserAnalytics = async (period = 30) => {
  const response = await API.get(`/users/analytics?period=${period}`);
  return response.data;
};

// Update preferences
export const updateUserPreferences = async (preferences) => {
  const response = await API.put('/users/preferences', preferences);
  return response.data;
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  const response = await API.put('/users/change-password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};

// Delete account
export const deleteAccount = async (password) => {
  const response = await API.delete('/users/account', { data: { password } });
  return response.data;
};

export default {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  deleteProfilePicture,
  getUserStats,
  getUserAnalytics,
  updateUserPreferences,
  changePassword,
  deleteAccount,
};