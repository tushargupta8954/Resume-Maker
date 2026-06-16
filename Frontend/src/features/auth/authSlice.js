import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService.js";
import toast from "react-hot-toast";

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed. Try again.";
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Check credentials.";
      return rejectWithValue(message);
    }
  }
);


export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.getMe();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async (refreshToken, { rejectWithValue }) => {
    try {
      const data = await authService.refreshToken(refreshToken);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await authService.updateProfile(profileData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Profile update failed."
      );
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const data = await authService.changePassword(passwordData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Password change failed."
      );
    }
  }
);

export const forgotUserPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const data = await authService.forgotPassword(email);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Request failed.");
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const data = await authService.resetPassword(token, password);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Password reset failed."
      );
    }
  }
);

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
  successMessage: null,
  passwordResetSent: false,
  passwordResetSuccess: false,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.successMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    updateUserImage: (state, action) => {
      if (state.user) {
        state.user.profileImage = action.payload;
      }
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    updateTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
  },
  extraReducers: (builder) => {
    // ── Register ──────────────────────────────
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
        state.successMessage = action.payload.message;
        toast.success(action.payload.message);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // ── Login ─────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
        state.successMessage = action.payload.message;
        toast.success(`Welcome back, ${action.payload.data.user.firstName}! 👋`);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // ── Logout ────────────────────────────────
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        toast.success("Logged out successfully. See you soon! 👋");
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });

    // ── Fetch Current User ────────────────────
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      });

    // ── Refresh Token ─────────────────────────
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
        }
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });

    // ── Update Profile ────────────────────────
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.successMessage = action.payload.message;
        toast.success(action.payload.message);
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // ── Change Password ───────────────────────
    builder
      .addCase(changeUserPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeUserPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
        toast.success(action.payload.message);
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // ── Forgot Password ───────────────────────
    builder
      .addCase(forgotUserPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.passwordResetSent = false;
      })
      .addCase(forgotUserPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.passwordResetSent = true;
        state.successMessage = action.payload.message;
        toast.success(action.payload.message);
      })
      .addCase(forgotUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // ── Reset Password ────────────────────────
    builder
      .addCase(resetUserPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.passwordResetSuccess = false;
      })
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.passwordResetSuccess = true;
        state.successMessage = action.payload.message;
        toast.success(action.payload.message);
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const {
  logout,
  clearError,
  clearSuccess,
  updateUserImage,
  setInitialized,
  updateTokens,
} = authSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectPasswordResetSent = (state) => state.auth.passwordResetSent;
export const selectPasswordResetSuccess = (state) =>
  state.auth.passwordResetSuccess;

export default authSlice.reducer;