import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  resumes: [],
  currentResume: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Create axios instance with auth header
const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Get all resumes
export const getResumes = createAsyncThunk('resume/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.get(`${API_URL}/resumes`, getAuthHeaders(token));
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Get single resume
export const getResume = createAsyncThunk('resume/getOne', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.get(`${API_URL}/resumes/${id}`, getAuthHeaders(token));
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Create resume
export const createResume = createAsyncThunk(
  'resume/create',
  async (resumeData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post(
        `${API_URL}/resumes`,
        resumeData,
        getAuthHeaders(token)
      );
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update resume
export const updateResume = createAsyncThunk(
  'resume/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.put(
        `${API_URL}/resumes/${id}`,
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

// Delete resume
export const deleteResume = createAsyncThunk('resume/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    await axios.delete(`${API_URL}/resumes/${id}`, getAuthHeaders(token));
    return id;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Duplicate resume
export const duplicateResume = createAsyncThunk(
  'resume/duplicate',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post(
        `${API_URL}/resumes/${id}/duplicate`,
        {},
        getAuthHeaders(token)
      );
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    setCurrentResume: (state, action) => {
      state.currentResume = action.payload;
    },
    updateCurrentResume: (state, action) => {
      state.currentResume = { ...state.currentResume, ...action.payload };
    },
    clearCurrentResume: (state) => {
      state.currentResume = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all resumes
      .addCase(getResumes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getResumes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.resumes = action.payload;
      })
      .addCase(getResumes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get single resume
      .addCase(getResume.fulfilled, (state, action) => {
        state.currentResume = action.payload;
      })
      // Create resume
      .addCase(createResume.fulfilled, (state, action) => {
        state.resumes.unshift(action.payload);
        state.currentResume = action.payload;
      })
      // Update resume
      .addCase(updateResume.fulfilled, (state, action) => {
        state.currentResume = action.payload;
        const index = state.resumes.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.resumes[index] = action.payload;
        }
      })
      // Delete resume
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter((r) => r._id !== action.payload);
      })
      // Duplicate resume
      .addCase(duplicateResume.fulfilled, (state, action) => {
        state.resumes.unshift(action.payload);
      });
  },
});

export const { reset, setCurrentResume, updateCurrentResume, clearCurrentResume } =
  resumeSlice.actions;
export default resumeSlice.reducer;