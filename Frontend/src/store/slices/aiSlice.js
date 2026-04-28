import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = '/api/ai';

export const generateSummary = createAsyncThunk(
  'ai/generateSummary',
  async ({ jobTitle, experience, skills }) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/generate-summary`, 
      { jobTitle, experience, skills },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.summary;
  }
);

export const enhanceDescription = createAsyncThunk(
  'ai/enhanceDescription',
  async ({ jobTitle, description }) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/enhance-description`,
      { jobTitle, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.enhanced;
  }
);

export const suggestSkills = createAsyncThunk(
  'ai/suggestSkills',
  async ({ jobRole, experience }) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/suggest-skills`,
      { jobRole, experience },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.skills;
  }
);

export const analyzeATS = createAsyncThunk(
  'ai/analyzeATS',
  async ({ resumeId, jobDescription }) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/analyze-ats`,
      { resumeId, jobDescription },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.analysis;
  }
);

export const getResumeScore = createAsyncThunk(
  'ai/getScore',
  async (resumeId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/score/${resumeId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.score;
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    summary: null,
    enhancedDescription: null,
    suggestedSkills: [],
    atsAnalysis: null,
    resumeScore: null,
    isLoading: false
  },
  reducers: {
    clearAIResults: (state) => {
      state.summary = null;
      state.enhancedDescription = null;
      state.suggestedSkills = [];
      state.atsAnalysis = null;
      state.resumeScore = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateSummary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generateSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
        toast.success('Professional summary generated!');
      })
      .addCase(generateSummary.rejected, (state) => {
        state.isLoading = false;
        toast.error('Failed to generate summary');
      })
      .addCase(suggestSkills.fulfilled, (state, action) => {
        state.suggestedSkills = action.payload;
        toast.success('Skills suggested!');
      })
      .addCase(analyzeATS.fulfilled, (state, action) => {
        state.atsAnalysis = action.payload;
        toast.success('ATS analysis complete!');
      })
      .addCase(getResumeScore.fulfilled, (state, action) => {
        state.resumeScore = action.payload;
      });
  }
});

export const { clearAIResults } = aiSlice.actions;
export default aiSlice.reducer;