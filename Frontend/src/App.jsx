import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCurrentUser,
  selectIsAuthenticated,
  selectAccessToken,
} from "./features/auth/authSlice.js";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import GuestRoute from "./components/auth/GuestRoute.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import Loader from "./components/common/Loader.jsx";

// ── Eager (small / always needed) ────────────────────────────────────────────
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";

// ── Lazy (code-split) ─────────────────────────────────────────────────────────
const DashboardPage     = lazy(() => import("./pages/dashboard/DashboardPage.jsx"));
const ResumesPage       = lazy(() => import("./pages/resume/ResumesPage.jsx"));
const ResumeBuilderPage = lazy(() => import("./pages/resume/ResumeBuilderPage.jsx"));
const ResumePreviewPage = lazy(() => import("./pages/resume/ResumePreviewPage.jsx"));
const ProfilePage       = lazy(() => import("./pages/profile/ProfilePage.jsx"));
const AnalyticsPage     = lazy(() => import("./pages/analytics/AnalyticsPage.jsx"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <Loader variant="dots" message="Loading page..." />
  </div>
);

const S = ({ children }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const accessToken     = useSelector(selectAccessToken);

  // Re-hydrate user on hard refresh if token exists
  useEffect(() => {
    if (accessToken && isAuthenticated) {
      dispatch(fetchCurrentUser());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      {/* ── Public landing ───────────────────────────────────────────────── */}
      <Route path="/" element={<LandingPage />} />

      {/* ── Guest-only ───────────────────────────────────────────────────── */}
      <Route path="/login"           element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register"        element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
      <Route path="/reset-password/:token" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />

      {/* ── Protected — with sidebar layout ──────────────────────────────── */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<S><DashboardPage /></S>} />
        <Route path="/resumes"   element={<S><ResumesPage /></S>} />
        <Route path="/analytics" element={<S><AnalyticsPage /></S>} />
        <Route path="/profile"   element={<S><ProfilePage /></S>} />
      </Route>

      {/* ── Protected — full-screen (no sidebar) ─────────────────────────── */}
      <Route path="/resumes/new"         element={<ProtectedRoute><S><ResumeBuilderPage /></S></ProtectedRoute>} />
      <Route path="/resumes/:id/edit"    element={<ProtectedRoute><S><ResumeBuilderPage /></S></ProtectedRoute>} />
      <Route path="/resumes/:id/preview" element={<ProtectedRoute><S><ResumePreviewPage /></S></ProtectedRoute>} />
      <Route path="/resumes/:id/ai"      element={<ProtectedRoute><S><ResumeBuilderPage /></S></ProtectedRoute>} />

      {/* ── 404 ──────────────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;