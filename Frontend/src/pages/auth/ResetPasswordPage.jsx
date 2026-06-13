import { useState } from "react";
import { useParams } from "react-router-dom";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import AuthLayout from "../../components/layout/AuthLayout.jsx";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import ProgressBar from "../../components/common/ProgressBar.jsx";
import useAuth from "../../hooks/useAuth.js";

const passwordStrengthChecks = [
  { label: "8+ characters", regex: /.{8,}/ },
  { label: "Uppercase", regex: /[A-Z]/ },
  { label: "Lowercase", regex: /[a-z]/ },
  { label: "Number", regex: /\d/ },
];

const ResetPasswordPage = () => {
  const { token } = useParams();
  const { resetPassword, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [strength, setStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      setStrength(passwordStrengthChecks.filter((c) => c.regex.test(value)).length);
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = "Password is required";
    else if (strength < 3) newErrors.password = "Password is not strong enough";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await resetPassword(token, formData.password);
  };

  const strengthColors = { 0: "danger", 1: "danger", 2: "warning", 3: "info", 4: "success" };

  return (
    <AuthLayout
      title="Set new password 🔑"
      subtitle="Choose a strong password you'll remember."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Input
            label="New Password"
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
          {formData.password && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 space-y-2"
            >
              <ProgressBar
                value={strength}
                max={4}
                color={strengthColors[strength]}
                size="sm"
                showPercentage={false}
                animated={false}
              />
              <div className="flex flex-wrap gap-2">
                {passwordStrengthChecks.map((check) => (
                  <span
                    key={check.label}
                    className={`flex items-center gap-1 text-xs ${
                      check.regex.test(formData.password)
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {check.label}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>

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

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          icon={ArrowRight}
          iconPosition="right"
        >
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;