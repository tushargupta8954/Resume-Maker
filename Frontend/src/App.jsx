import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './redux/slices/authSlice';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import ResumeBuilder from './pages/builder/ResumeBuilder';
import ResumeList from './pages/resumes/ResumeList';
import Settings from './pages/settings/Settings';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';

// Components
import PrivateRoute from './components/PrivateRoute';
import Loader from './components/common/Loader';

function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/resumes"
          element={
            <PrivateRoute>
              <ResumeList />
            </PrivateRoute>
          }
        />
        <Route
          path="/builder/:id?"
          element={
            <PrivateRoute>
              <ResumeBuilder />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;