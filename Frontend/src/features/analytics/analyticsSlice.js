import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { analyticsService } from "../../services/analyticsService.js";

export const fetchDashboardAnalytics = createAsyncThunk(
  "analytics/fetchDashboard",
  async (days, { rejectWithValue }) => {
    try {
      const data = await analyticsService.getDashboardAnalytics(days);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch analytics."
      );
    }
  }
);

export const fetchResumeAnalytics = createAsyncThunk(
  "analytics/fetchResume",
  async ({ resumeId, days }, { rejectWithValue }) => {
    try {
      const data = await analyticsService.getResumeAnalytics(resumeId, days);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch resume analytics."
      );
    }
  }
);

export const trackAnalyticsEvent = createAsyncThunk(
  "analytics/track",
  async (eventData, { rejectWithValue }) => {
    try {
      const data = await analyticsService.trackEvent(eventData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  dashboard: null,
  resumeAnalytics: null,
  isLoading: false,
  error: null,
  selectedPeriod: 30,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setSelectedPeriod: (state, action) => {
      state.selectedPeriod = action.payload;
    },
    clearAnalyticsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboard = action.payload.data;
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchResumeAnalytics.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchResumeAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumeAnalytics = action.payload.data;
      })
      .addCase(fetchResumeAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedPeriod, clearAnalyticsError } =
  analyticsSlice.actions;

export const selectDashboardAnalytics = (state) => state.analytics.dashboard;
export const selectResumeAnalytics = (state) => state.analytics.resumeAnalytics;
export const selectAnalyticsLoading = (state) => state.analytics.isLoading;
export const selectSelectedPeriod = (state) => state.analytics.selectedPeriod;

export default analyticsSlice.reducer;