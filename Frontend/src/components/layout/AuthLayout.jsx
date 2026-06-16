import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, FileText, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Writing",
    description: "Generate professional summaries and enhance your experience descriptions",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Zap,
    title: "ATS Optimization",
    description: "Score 90+ on Applicant Tracking Systems with smart keyword suggestions",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: FileText,
    title: "Beautiful Templates",
    description: "Choose from 7 stunning, professionally designed resume templates",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is encrypted and secure. Export anytime, own everything.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

const stats = [
  { value: "50K+", label: "Resumes Created" },
  { value: "94%", label: "ATS Pass Rate" },
  { value: "3x", label: "More Interviews" },
];

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 gradient-bg-hero" />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-purple-300/20 blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-300/10 blur-3xl animate-float"
          style={{ animationDelay: "0.75s" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30"
            >
              <span className="text-white text-xl font-bold font-display">R</span>
            </motion.div>
            <div>
              <span className="text-white text-xl font-bold font-display">
                ResumeAI
              </span>
              <span className="text-white/60 text-xs block">
                Build. Impress. Get Hired.
              </span>
            </div>
          </Link>

          {/* Main content */}
          <div className="my-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl xl:text-5xl font-bold font-display text-white leading-tight mb-6">
                Build Your{" "}
                <span className="relative">
                  <span className="relative z-10">Dream</span>
                  <div className="absolute -bottom-1 left-0 right-0 h-3 bg-white/20 rounded-full blur-sm" />
                </span>{" "}
                Resume
                <br />
                With{" "}
                <span className="text-cyan-300">AI Power</span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-md">
                Create professional, ATS-optimized resumes in minutes with our
                AI assistant. Land more interviews, faster.
              </p>
            </motion.div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-3 mb-10">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <div className={`${feature.bg} p-2.5 rounded-xl flex-shrink-0`}>
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-white/60 text-xs leading-relaxed mt-0.5">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 + 0.7 }}
                  className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <div className="text-2xl font-bold text-white font-display">
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-xs mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-white/40 text-center text-xs mt-8">
            © 2024 ResumeAI. All rights reserved. Made with ❤️
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex flex-col">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 p-6 border-b border-slate-100">
          <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <span className="font-bold text-slate-800 text-lg font-display">
            ResumeAI
          </span>
        </div>

        {/* Scrollable form area */}
        <div className="flex-1 flex items-center justify-center overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md px-6 py-10"
          >
            {/* Title */}
            {title && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 font-bold">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-slate-500 text-sm mt-2">{subtitle}</p>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;