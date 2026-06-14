import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  changeUserPassword,
  forgotUserPassword,
  resetUserPassword,
  clearError,
  clearSuccess,
} from "../features/auth/authSlice.js";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const login = async (credentials) => {
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard");
      return true;
    }
    return false;
  };

  const register = async (userData) => {
    const result = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(result)) {
      navigate("/dashboard");
      return true;
    }
    return false;
  };

  const logout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const updateProfile = async (data) => {
    const result = await dispatch(updateUserProfile(data));
    return updateUserProfile.fulfilled.match(result);
  };

  const changePassword = async (data) => {
    const result = await dispatch(changeUserPassword(data));
    return changeUserPassword.fulfilled.match(result);
  };

  const forgotPassword = async (email) => {
    const result = await dispatch(forgotUserPassword(email));
    return forgotUserPassword.fulfilled.match(result);
  };

  const resetPassword = async (token, password) => {
    const result = await dispatch(resetUserPassword({ token, password }));
    if (resetUserPassword.fulfilled.match(result)) {
      navigate("/login");
      return true;
    }
    return false;
  };

  const clearAuthError = () => dispatch(clearError());
  const clearAuthSuccess = () => dispatch(clearSuccess());

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    clearAuthError,
    clearAuthSuccess,
  };
};

export default useAuth;