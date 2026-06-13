import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "../features/auth/authSlice.js";
import resumeReducer from "../features/resume/resumeSlice.js";
import aiReducer from "../features/ai/aiSlice.js";
import analyticsReducer from "../features/analytics/analyticsSlice.js";

// Persist config for auth only (tokens & user data)
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "accessToken", "refreshToken", "isAuthenticated"],
};

// Persist config for UI preferences
const resumePersistConfig = {
  key: "resume",
  storage,
  whitelist: ["currentTemplate", "colorScheme", "sectionOrder"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  resume: persistReducer(resumePersistConfig, resumeReducer),
  ai: aiReducer,
  analytics: analyticsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);

export default store;