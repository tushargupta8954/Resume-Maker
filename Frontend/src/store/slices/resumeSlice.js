import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = '/api/resume';

export const fetchResumes = createAsyncThunk(
  'resume/fetchAll',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.resumes;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createResume = createAsyncThunk(
  'resume/create',
  async (resumeData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_URL, resumeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Resume created successfully!');
      return response.data.resume;
    } catch (error) {
      toast.error('Failed to create resume');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateResume = createAsyncThunk(
  'resume/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Resume updated successfully!');
      return response.data.resume;
    } catch (error) {
      toast.error('Failed to update resume');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteResume = createAsyncThunk(
  'resume/delete',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Resume deleted successfully!');
      return id;
    } catch (error) {
      toast.error('Failed to delete resume');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const exportToPDF = createAsyncThunk(
  'resume/export',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/${id}/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF exported successfully!');
      return true;
    } catch (error) {
      toast.error('Failed to export PDF');
      return rejectWithValue(error.response?.data);
    }
  }
);

const resumeSlice = createSlice({
  name: 'resume',
  initialState: {
    resumes: [],
    currentResume: null,
    isLoading: false,
    error: null
  },
  reducers: {
    setCurrentResume: (state, action) => {
      state.currentResume = action.payload;
    },
    clearCurrentResume: (state) => {
      state.currentResume = null;
    },
    updateCurrentResume: (state, action) => {
      state.currentResume = { ...state.currentResume, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumes = action.payload;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createResume.fulfilled, (state, action) => {
        state.resumes.unshift(action.payload);
        state.currentResume = action.payload;
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        const index = state.resumes.findIndex(r => r._id === action.payload._id);
        if (index !== -1) state.resumes[index] = action.payload;
        if (state.currentResume?._id === action.payload._id) {
          state.currentResume = action.payload;
        }
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter(r => r._id !== action.payload);
        if (state.currentResume?._id === action.payload) {
          state.currentResume = null;
        }
      });
  }
});

export const { setCurrentResume, clearCurrentResume, updateCurrentResume } = resumeSlice.actions;
export default resumeSlice.reducer;