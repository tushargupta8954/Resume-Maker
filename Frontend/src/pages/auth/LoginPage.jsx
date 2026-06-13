import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Github, Chrome } from "lucide-react";
import { motion } from "framer-motion";

import AuthLayout from "../../components/layout/AuthLayout.jsx";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import useAuth from "../../hooks/useAuth.js";

const LoginPage = () => {
  const { login, isLoading, error, clearAuthError } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    clearAuthError();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await login(formData);
  };

  return (
    <AuthLayout
      title="Welcome back! 👋"
      subtitle="Sign in to continue building your dream resume."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={Mail}
          autoComplete="email"
          required
        />

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-700">
              Password <span className="text-red-500">*</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={Lock}
            autoComplete="current-password"
          />
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
          />
          <label
            htmlFor="rememberMe"
            className="text-sm text-slate-600 cursor-pointer"
          >
            Remember me for 30 days
          </label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          icon={ArrowRight}
          iconPosition="right"
        >
          Sign In
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white text-slate-400">or continue with</span>
          </div>
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            <Chrome className="w-4 h-4 text-red-500" />
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            <Github className="w-4 h-4" />
            GitHub
          </button>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
          >
            Create one free →
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;