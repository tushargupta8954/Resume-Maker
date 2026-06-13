import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, FileText, Target, Zap, Shield, BarChart3,
  ArrowRight, Check, Star, ChevronRight, Download,
  Globe, Users, Award,
} from "lucide-react";
import Button from "../components/common/Button.jsx";
import Badge from "../components/common/Badge.jsx";

// ── Data ──────────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Writing",
    description:
      "Generate professional summaries, enhance work experience and get smart suggestions powered by Google Gemini.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    icon: Target,
    title: "ATS Optimisation",
    description:
      "Score 90+ on Applicant Tracking Systems. Get keyword analysis and actionable fixes instantly.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: FileText,
    title: "7 Premium Templates",
    description:
      "Modern, Classic, Minimal, Creative, Executive, Tech & Elegant. All fully customisable with your brand colours.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
  {
    icon: Zap,
    title: "Voice-to-Text Input",
    description:
      "Dictate your resume sections hands-free. Our speech recognition converts your words instantly.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Track views, downloads and ATS scores over time. Understand what's working with live charts.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-100",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "End-to-end encryption, JWT auth and secure cloud storage. Your data belongs to you — always.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
];

const stats = [
  { icon: Users,    value: "50,000+", label: "Resumes Created"   },
  { icon: Award,    value: "94%",     label: "ATS Pass Rate"     },
  { icon: Star,     value: "4.9/5",   label: "Average Rating"    },
  { icon: Download, value: "120K+",   label: "PDF Exports"       },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect to get started",
    features: [
      "3 resumes",
      "All 7 templates",
      "PDF export",
      "5 AI requests/day",
      "Basic ATS checker",
    ],
    cta: "Get Started",
    variant: "secondary",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For serious job seekers",
    features: [
      "Unlimited resumes",
      "50 AI requests/day",
      "Advanced ATS checker",
      "Job description matching",
      "Keyword optimiser",
      "Analytics dashboard",
      "AI background removal",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    variant: "primary",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$29",
    period: "per month",
    description: "For teams & recruiters",
    features: [
      "Everything in Pro",
      "Unlimited AI requests",
      "Team management",
      "Custom branding",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    variant: "dark",
    popular: false,
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer @ Google",
    avatar: "SC",
    text: "I got 3 interviews in one week after using ResumeAI to optimise my resume. The ATS checker alone is worth it.",
    rating: 5,
  },
  {
    name: "Marcus Williams",
    role: "Product Manager @ Meta",
    avatar: "MW",
    text: "The AI summary generator saved me hours of work. My resume went from generic to genuinely impressive.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Data Scientist @ Amazon",
    avatar: "PS",
    text: "The job description matching feature helped me tailor every application. Landed my dream role in 3 weeks!",
    rating: 5,
  },
];

// ── Animations ────────────────────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

// ── Component ─────────────────────────────────────────────────────────────────
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center shadow-md shadow-indigo-200/50">
              <span className="text-white font-bold text-base font-display">R</span>
            </div>
            <span className="font-bold text-slate-800 text-lg font-display">ResumeAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Templates", "Pricing", "About"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Sign In
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-bg-hero opacity-5 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)",
            backgroundSize: "32px 32px",
            opacity: 0.4,
          }}
        />

        {/* Floating orbs */}
        <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-indigo-100 blur-3xl opacity-60 animate-float" />
        <div className="absolute top-40 -right-20 w-96 h-96 rounded-full bg-violet-100 blur-3xl opacity-60 animate-float"
          style={{ animationDelay: "1.5s" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
            <Badge variant="gradient" size="md" className="mb-6 inline-flex">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by Google Gemini AI
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black font-display text-slate-900 leading-none mb-6">
              Build Resumes That
              <br />
              <span className="gradient-text">Get You Hired</span>
            </h1>

            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
              AI-powered resume builder with live preview, ATS optimisation,
              voice input and beautiful templates. Land more interviews —
              starting today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/register">
                <Button variant="primary"  size="xl" icon={ArrowRight} iconPosition="right">
                  Create Free Resume
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="xl" icon={FileText}>
                  View Demo
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-400">
              {["No credit card required", "Free forever plan", "50,000+ users"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Hero illustration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 relative max-w-5xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
              {/* Mock browser chrome */}
              <div className="bg-slate-100 px-4 py-3 flex items-center gap-2 border-b border-slate-200">
                {["bg-red-400", "bg-amber-400", "bg-emerald-400"].map((c) => (
                  <div key={c} className={`w-3 h-3 rounded-full ${c}`} />
                ))}
                <div className="flex-1 mx-4 bg-white rounded-lg h-6 flex items-center px-3">
                  <Globe className="w-3 h-3 text-slate-400 mr-2" />
                  <span className="text-xs text-slate-400">resumeai.app/builder</span>
                </div>
              </div>

              {/* Mock app UI */}
              <div className="bg-slate-50 h-80 sm:h-[420px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 gradient-bg-hero opacity-5" />
                <div className="relative z-10 text-center px-8">
                  <div className="w-20 h-20 gradient-bg rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200/50 animate-float">
                    <span className="text-white text-3xl font-bold font-display">R</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-700 font-display mb-2">
                    Live Resume Preview
                  </h3>
                  <p className="text-slate-400 text-sm max-w-sm">
                    Watch your resume update in real-time as you type.
                    AI suggestions appear instantly.
                  </p>
                  <Link to="/register" className="mt-5 inline-block">
                    <Button variant="primary" size="md">Try It Now →</Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -left-4 sm:-left-10 glass rounded-2xl px-4 py-3 shadow-medium border border-white/60"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Target className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">ATS Score</p>
                  <p className="text-lg font-black text-emerald-600 leading-none">94%</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -right-4 sm:-right-10 glass rounded-2xl px-4 py-3 shadow-medium border border-white/60"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">AI Summary</p>
                  <p className="text-xs text-slate-500 leading-none">Generated ✓</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, value, label }, idx) => (
              <motion.div
                key={label}
                {...fadeUp}
                transition={{ delay: idx * 0.08 }}
                className="text-center"
              >
                <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-indigo-200/50">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-black font-display text-slate-800">{value}</p>
                <p className="text-sm text-slate-500 mt-1">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <Badge variant="primary" size="md" className="mb-4">Features</Badge>
            <h2 className="text-4xl font-black font-display text-slate-900 mb-4">
              Everything You Need to
              <br />
              <span className="gradient-text">Land Your Dream Job</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              From AI writing assistance to ATS optimisation — all in one place.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, color, bg, border }, idx) => (
              <motion.div
                key={title}
                {...fadeUp}
                transition={{ delay: idx * 0.07 }}
                whileHover={{ y: -4 }}
                className={`p-6 rounded-2xl border-2 ${border} bg-white shadow-soft hover:shadow-medium transition-all`}
              >
                <div className={`${bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <Badge variant="primary" size="md" className="mb-4">Pricing</Badge>
            <h2 className="text-4xl font-black font-display text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-500">
              Start free. Upgrade when you're ready.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map(({ name, price, period, description, features: planFeatures, cta, variant, popular }, idx) => (
              <motion.div
                key={name}
                {...fadeUp}
                transition={{ delay: idx * 0.1 }}
                className={`relative p-6 rounded-3xl border-2 ${
                  popular
                    ? "border-indigo-400 shadow-glow-strong bg-white"
                    : "border-slate-200 bg-white shadow-soft"
                }`}
              >
                {popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge variant="gradient" size="md">⭐ Most Popular</Badge>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{name}</h3>
                  <p className="text-sm text-slate-500">{description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-black font-display text-slate-900">{price}</span>
                  <span className="text-slate-400 text-sm ml-2">/ {period}</span>
                </div>

                <ul className="space-y-2.5 mb-7">
                  {planFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link to="/register">
                  <Button variant={variant} fullWidth size="md">
                    {cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <Badge variant="primary" size="md" className="mb-4">Testimonials</Badge>
            <h2 className="text-4xl font-black font-display text-slate-900 mb-4">
              Loved by Job Seekers
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, avatar, text, rating }, idx) => (
              <motion.div
                key={name}
                {...fadeUp}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-3xl border border-slate-100 bg-white shadow-soft hover:shadow-medium transition-all"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-5">"{text}"</p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{name}</p>
                    <p className="text-xs text-slate-500">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────────── */}
      <section className="py-24 mx-4 sm:mx-6 mb-12">
        <motion.div
          {...fadeUp}
          className="max-w-5xl mx-auto gradient-bg-hero rounded-3xl p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
          <div className="relative z-10">
            <h2 className="text-4xl font-black font-display mb-4">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Join 50,000+ professionals who've supercharged their job search
              with ResumeAI. It's free to start.
            </p>
            <Link to="/register">
              <Button
                variant="secondary"
                size="xl"
                icon={ArrowRight}
                iconPosition="right"
                className="bg-white text-indigo-600 hover:bg-slate-50 border-0 shadow-lg"
              >
                Create Your Free Resume
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 gradient-bg rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="font-bold text-slate-800 font-display">ResumeAI</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                AI-powered resume builder helping professionals land their dream jobs.
              </p>
            </div>

            {/* Links */}
            {[
              { title: "Product",  links: ["Features", "Templates", "Pricing", "Changelog"] },
              { title: "Company",  links: ["About", "Blog", "Careers", "Press"] },
              { title: "Support",  links: ["Help Center", "Privacy Policy", "Terms of Service", "Contact"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-semibold text-slate-800 text-sm mb-3">{title}</h4>
                <ul className="space-y-2">
                  {links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-slate-400">
              © 2024 ResumeAI. All rights reserved.
            </p>
            <p className="text-sm text-slate-400">
              Built with ❤️ using the MERN stack + AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;