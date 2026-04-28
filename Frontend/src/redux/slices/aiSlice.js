import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  generatedSummary: null,
  enhancedExperience: null,
  suggestedSkills: null,
  atsScore: null,
  optimization: null,
  suggestions: [],
  isLoading: false,
  isError: false,
  message: '',
};

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Generate summary
export const generateSummary = createAsyncThunk(
  'ai/generateSummary',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post(
        `${API_URL}/ai/generate-summary`,
        data,
        getAuthHeaders(token)
      );
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Enhance experience
export const enhanceExperience = createAsyncThunk(
  'ai/enhanceExperience',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post(
        `${API_URL}/ai/enhance-experience`,
        data,
        getAuthHeaders(token)
      );
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Suggest skills
export const suggestSkills = createAsyncThunk(
  'ai/suggestSkills',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post(
        `${API_URL}/ai/suggest-skills`,
        data,
        getAuthHeaders(token)
      );
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Check ATS
export const checkATS = createAsyncThunk('ai/checkATS', async (data, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.post(
      `${API_URL}/ai/ats-check`,
      data,
      getAuthHeaders(token)
    );
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Optimize resume
export const optimizeResume = createAsyncThunk(
  'ai/optimizeResume',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post(
        `${API_URL}/ai/optimize-resume`,
        data,
        getAuthHeaders(token)
      );
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get suggestions
export const getSuggestions = createAsyncThunk(
  'ai/getSuggestions',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post(
        `${API_URL}/ai/suggestions`,
        data,
        getAuthHeaders(token)
      );
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
    clearAIData: (state) => {
      state.generatedSummary = null;
      state.enhancedExperience = null;
      state.suggestedSkills = null;
      state.atsScore = null;
      state.optimization = null;
      state.suggestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate summary
      .addCase(generateSummary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generateSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.generatedSummary = action.payload;
      })
      .addCase(generateSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Enhance experience
      .addCase(enhanceExperience.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(enhanceExperience.fulfilled, (state, action) => {
        state.isLoading = false;
        state.enhancedExperience = action.payload;
      })
      .addCase(enhanceExperience.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Suggest skills
      .addCase(suggestSkills.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(suggestSkills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.suggestedSkills = action.payload;
      })
      .addCase(suggestSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Check ATS
      .addCase(checkATS.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkATS.fulfilled, (state, action) => {
        state.isLoading = false;
        state.atsScore = action.payload;
      })
      .addCase(checkATS.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Optimize resume
      .addCase(optimizeResume.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(optimizeResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.optimization = action.payload;
      })
      .addCase(optimizeResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get suggestions
      .addCase(getSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      });
  },
});

export const { reset, clearAIData } = aiSlice.actions;
export default aiSlice.reducer;