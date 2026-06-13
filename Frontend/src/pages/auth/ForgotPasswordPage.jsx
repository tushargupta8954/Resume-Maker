import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import AuthLayout from "../../components/layout/AuthLayout.jsx";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import useAuth from "../../hooks/useAuth.js";
import { useSelector } from "react-redux";
import { selectPasswordResetSent } from "../../features/auth/authSlice.js";

const ForgotPasswordPage = () => {
  const { forgotPassword, isLoading } = useAuth();
  const passwordResetSent = useSelector(selectPasswordResetSent);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (!email) { setError("Email is required"); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await forgotPassword(email);
  };

  if (passwordResetSent) {
    return (
      <AuthLayout>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3 font-display">
            Check your email!
          </h2>
          <p className="text-slate-500 text-sm mb-2">
            We've sent a password reset link to
          </p>
          <p className="text-indigo-600 font-semibold mb-6">{email}</p>
          <p className="text-slate-400 text-xs mb-8">
            The link expires in 10 minutes. Check spam if you don't see it.
          </p>
          <div className="space-y-3">
            <Button
              variant="primary"
              fullWidth
              onClick={() => forgotPassword(email)}
              isLoading={isLoading}
            >
              Resend Email
            </Button>
            <Link to="/login">
              <Button variant="ghost" fullWidth icon={ArrowLeft}>
                Back to Login
              </Button>
            </Link>
          </div>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password? 🔐"
      subtitle="No worries! Enter your email and we'll send a reset link."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          error={error}
          icon={Mail}
          autoComplete="email"
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          icon={Send}
          iconPosition="right"
        >
          Send Reset Link
        </Button>

        <Link to="/login">
          <Button variant="ghost" size="md" fullWidth icon={ArrowLeft}>
            Back to Login
          </Button>
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;