import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import AuthLayout from "../../components/layout/AuthLayout.jsx";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import ProgressBar from "../../components/common/ProgressBar.jsx";
import useAuth from "../../hooks/useAuth.js";

const passwordStrengthChecks = [
  { label: "At least 8 characters", regex: /.{8,}/ },
  { label: "One uppercase letter", regex: /[A-Z]/ },
  { label: "One lowercase letter", regex: /[a-z]/ },
  { label: "One number", regex: /\d/ },
];

const RegisterPage = () => {
  const { register, isLoading, clearAuthError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    clearAuthError();
  }, []);

  useEffect(() => {
    const passed = passwordStrengthChecks.filter((c) =>
      c.regex.test(formData.password)
    ).length;
    setPasswordStrength(passed);
  }, [formData.password]);

  const strengthColors = {
    0: "danger",
    1: "danger",
    2: "warning",
    3: "info",
    4: "success",
  };

  const strengthLabels = {
    0: "",
    1: "Weak",
    2: "Fair",
    3: "Good",
    4: "Strong",
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (passwordStrength < 3)
      newErrors.password = "Password is not strong enough";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!agreeToTerms)
      newErrors.terms = "You must agree to the terms to continue";
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
    const { confirmPassword, ...submitData } = formData;
    await register(submitData);
  };

  return (
    <AuthLayout
      title="Create your account ✨"
      subtitle="Start building your professional resume today. Free forever."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            icon={User}
            autoComplete="given-name"
            required
          />
          <Input
            label="Last Name"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            autoComplete="family-name"
            required
          />
        </div>

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
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={Lock}
            autoComplete="new-password"
            required
          />

          {/* Password strength */}
          <AnimatePresence>
            {formData.password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-2"
              >
                <ProgressBar
                  value={passwordStrength}
                  max={4}
                  color={strengthColors[passwordStrength]}
                  size="sm"
                  showPercentage={false}
                  animated={false}
                />
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {passwordStrengthChecks.map((check) => (
                      <div
                        key={check.label}
                        className={`flex items-center gap-1 text-xs ${
                          check.regex.test(formData.password)
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                        {check.label}
                      </div>
                    ))}
                  </div>
                  {passwordStrength > 0 && (
                    <span
                      className={`text-xs font-medium flex-shrink-0 ${
                        passwordStrength === 4
                          ? "text-emerald-600"
                          : passwordStrength === 3
                          ? "text-blue-600"
                          : passwordStrength === 2
                          ? "text-amber-600"
                          : "text-red-600"
                      }`}
                    >
                      {strengthLabels[passwordStrength]}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          success={
            formData.confirmPassword &&
            formData.password === formData.confirmPassword
              ? "Passwords match!"
              : ""
          }
          icon={Lock}
          autoComplete="new-password"
          required
        />

        {/* Terms */}
        <div>
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => {
                setAgreeToTerms(e.target.checked);
                if (errors.terms)
                  setErrors((prev) => ({ ...prev, terms: "" }));
              }}
              className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="text-sm text-slate-600 leading-relaxed">
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1.5 text-xs text-red-500">{errors.terms}</p>
          )}
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
          Create Free Account
        </Button>

        {/* Login link */}
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
          >
            Sign in →
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;