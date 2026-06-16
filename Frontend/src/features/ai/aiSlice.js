import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { aiService } from "../../services/aiService.js";
import { updateSummary, updateATSScore } from "../resume/resumeSlice.js";
import toast from "react-hot-toast";

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const generateAISummary = createAsyncThunk(
  "ai/generateSummary",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const result = await aiService.generateSummary(data);
      if (result.data?.summary) {
        dispatch(updateSummary(result.data.summary));
      }
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate summary."
      );
    }
  }
);

export const enhanceExperience = createAsyncThunk(
  "ai/enhanceExperience",
  async (data, { rejectWithValue }) => {
    try {
      const result = await aiService.enhanceExperience(data);
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to enhance experience."
      );
    }
  }
);

export const getSuggestedSkills = createAsyncThunk(
  "ai/suggestSkills",
  async (data, { rejectWithValue }) => {
    try {
      const result = await aiService.suggestSkills(data);
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to suggest skills."
      );
    }
  }
);

export const getATSScore = createAsyncThunk(
  "ai/atsScore",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const result = await aiService.calculateATSScore(data);
      if (result.data?.atsScore) {
        dispatch(updateATSScore(result.data.atsScore));
      }
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to calculate ATS score."
      );
    }
  }
);

export const customizeResumeForJob = createAsyncThunk(
  "ai/customizeForJob",
  async (data, { rejectWithValue }) => {
    try {
      const result = await aiService.customizeForJob(data);
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to customize resume."
      );
    }
  }
);

export const optimizeKeywords = createAsyncThunk(
  "ai/optimizeKeywords",
  async (data, { rejectWithValue }) => {
    try {
      const result = await aiService.optimizeKeywords(data);
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to optimize keywords."
      );
    }
  }
);

export const generateProjectDescription = createAsyncThunk(
  "ai/generateProject",
  async (data, { rejectWithValue }) => {
    try {
      const result = await aiService.generateProjectDescription(data);
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate project description."
      );
    }
  }
);

export const getImprovementTips = createAsyncThunk(
  "ai/improvementTips",
  async (data, { rejectWithValue }) => {
    try {
      const result = await aiService.getImprovementTips(data);
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get improvement tips."
      );
    }
  }
);

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  // Summary
  generatedSummary: null,
  summaryLoading: false,

  // Experience enhancement
  enhancedExperience: null,
  experienceLoading: false,

  // Skills suggestions
  suggestedSkills: null,
  skillsLoading: false,

  // ATS Score
  atsScore: null,
  atsLoading: false,

  // Job customization
  jobCustomization: null,
  jobLoading: false,

  // Keywords
  keywordOptimization: null,
  keywordsLoading: false,

  // Project description
  projectDescription: null,
  projectLoading: false,

  // Improvement tips
  improvementTips: null,
  tipsLoading: false,

  // General
  error: null,
  activeFeature: null,

  // AI Usage tracking
  usageToday: 0,
  dailyLimit: 50,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    clearAIResults: (state, action) => {
      const feature = action.payload;
      if (feature === "summary") state.generatedSummary = null;
      if (feature === "experience") state.enhancedExperience = null;
      if (feature === "skills") state.suggestedSkills = null;
      if (feature === "ats") state.atsScore = null;
      if (feature === "job") state.jobCustomization = null;
      if (feature === "keywords") state.keywordOptimization = null;
      if (feature === "project") state.projectDescription = null;
      if (feature === "tips") state.improvementTips = null;
    },
    setActiveFeature: (state, action) => {
      state.activeFeature = action.payload;
    },
    clearAIError: (state) => {
      state.error = null;
    },
    clearAllAI: (state) => {
      state.generatedSummary = null;
      state.enhancedExperience = null;
      state.suggestedSkills = null;
      state.atsScore = null;
      state.jobCustomization = null;
      state.keywordOptimization = null;
      state.projectDescription = null;
      state.improvementTips = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Generate Summary ──────────────────────
    builder
      .addCase(generateAISummary.pending, (state) => {
        state.summaryLoading = true;
        state.error = null;
      })
      .addCase(generateAISummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.generatedSummary = action.payload.data?.summary;
        state.usageToday += 1;
        toast.success("Professional summary generated! ✨");
      })
      .addCase(generateAISummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // ── Enhance Experience ────────────────────
    builder
      .addCase(enhanceExperience.pending, (state) => {
        state.experienceLoading = true;
        state.error = null;
      })
      .addCase(enhanceExperience.fulfilled, (state, action) => {
        state.experienceLoading = false;
        state.enhancedExperience = action.payload.data?.enhanced;
        state.usageToday += 1;
        toast.success("Experience enhanced with AI! 🚀");
      })
      .addCase(enhanceExperience.rejected, (state, action) => {
        state.experienceLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // ── Suggest Skills ────────────────────────
    builder
      .addCase(getSuggestedSkills.pending, (state) => {
        state.skillsLoading = true;
        state.error = null;
      })
      .addCase(getSuggestedSkills.fulfilled, (state, action) => {
        state.skillsLoading = false;
        state.suggestedSkills = action.payload.data?.skills;
        state.usageToday += 1;
        toast.success("Skills suggested! 💡");
      })
      .addCase(getSuggestedSkills.rejected, (state, action) => {
        state.skillsLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // ── ATS Score ─────────────────────────────
    builder
      .addCase(getATSScore.pending, (state) => {
        state.atsLoading = true;
        state.error = null;
      })
      .addCase(getATSScore.fulfilled, (state, action) => {
        state.atsLoading = false;
        state.atsScore = action.payload.data?.atsScore;
        state.usageToday += 1;
        toast.success("ATS analysis complete! 📊");
      })
      .addCase(getATSScore.rejected, (state, action) => {
        state.atsLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // ── Job Customization ─────────────────────
    builder
      .addCase(customizeResumeForJob.pending, (state) => {
        state.jobLoading = true;
        state.error = null;
      })
      .addCase(customizeResumeForJob.fulfilled, (state, action) => {
        state.jobLoading = false;
        state.jobCustomization = action.payload.data?.customization;
        state.usageToday += 1;
        toast.success("Job customization analysis ready! 🎯");
      })
      .addCase(customizeResumeForJob.rejected, (state, action) => {
        state.jobLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // ── Keywords ──────────────────────────────
    builder
      .addCase(optimizeKeywords.pending, (state) => {
        state.keywordsLoading = true;
        state.error = null;
      })
      .addCase(optimizeKeywords.fulfilled, (state, action) => {
        state.keywordsLoading = false;
        state.keywordOptimization = action.payload.data?.optimization;
        state.usageToday += 1;
        toast.success("Keyword optimization ready! 🔑");
      })
      .addCase(optimizeKeywords.rejected, (state, action) => {
        state.keywordsLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // ── Project Description ───────────────────
    builder
      .addCase(generateProjectDescription.pending, (state) => {
        state.projectLoading = true;
        state.error = null;
      })
      .addCase(generateProjectDescription.fulfilled, (state, action) => {
        state.projectLoading = false;
        state.projectDescription = action.payload.data?.project;
        state.usageToday += 1;
        toast.success("Project description generated! 🛠️");
      })
      .addCase(generateProjectDescription.rejected, (state, action) => {
        state.projectLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // ── Improvement Tips ──────────────────────
    builder
      .addCase(getImprovementTips.pending, (state) => {
        state.tipsLoading = true;
        state.error = null;
      })
      .addCase(getImprovementTips.fulfilled, (state, action) => {
        state.tipsLoading = false;
        state.improvementTips = action.payload.data?.tips;
        state.usageToday += 1;
        toast.success("Improvement tips ready! 💡");
      })
      .addCase(getImprovementTips.rejected, (state, action) => {
        state.tipsLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearAIResults, setActiveFeature, clearAIError, clearAllAI } =
  aiSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectAI = (state) => state.ai;
export const selectGeneratedSummary = (state) => state.ai.generatedSummary;
export const selectSummaryLoading = (state) => state.ai.summaryLoading;
export const selectEnhancedExperience = (state) => state.ai.enhancedExperience;
export const selectExperienceLoading = (state) => state.ai.experienceLoading;
export const selectSuggestedSkills = (state) => state.ai.suggestedSkills;
export const selectSkillsLoading = (state) => state.ai.skillsLoading;
export const selectATSScore = (state) => state.ai.atsScore;
export const selectATSLoading = (state) => state.ai.atsLoading;
export const selectJobCustomization = (state) => state.ai.jobCustomization;
export const selectJobLoading = (state) => state.ai.jobLoading;
export const selectKeywordOptimization = (state) =>
  state.ai.keywordOptimization;
export const selectKeywordsLoading = (state) => state.ai.keywordsLoading;
export const selectProjectDescription = (state) => state.ai.projectDescription;
export const selectProjectLoading = (state) => state.ai.projectLoading; // ✅ Added missing selector
export const selectImprovementTips = (state) => state.ai.improvementTips;
export const selectTipsLoading = (state) => state.ai.tipsLoading;
export const selectActiveFeature = (state) => state.ai.activeFeature;
export const selectAIUsage = (state) => ({
  used: state.ai.usageToday,
  limit: state.ai.dailyLimit,
  percentage: Math.round((state.ai.usageToday / state.ai.dailyLimit) * 100),
});

export default aiSlice.reducer;