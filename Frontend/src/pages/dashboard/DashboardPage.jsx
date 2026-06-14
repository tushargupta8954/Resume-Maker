import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText, Download, Eye, TrendingUp, Plus,
  Sparkles, ArrowRight, Zap, Target, Award,
  Clock, BarChart2, ChevronRight,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, Legend,
} from "recharts";

import { fetchDashboardAnalytics, selectDashboardAnalytics, selectAnalyticsLoading } from "../../features/analytics/analyticsSlice.js";
import { fetchResumes, selectResumes } from "../../features/resume/resumeSlice.js";
import { selectUser } from "../../features/auth/authSlice.js";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import Loader from "../../components/common/Loader.jsx";
import Avatar from "../../components/common/Avatar.jsx";
import ProgressBar from "../../components/common/ProgressBar.jsx";
import { getATSColor, getATSLabel, formatDate } from "../../utils/helpers.js";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

const StatCard = ({ icon: Icon, label, value, change, color, bgColor, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Card className="relative overflow-hidden" hover>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-800 font-display">{value}</p>
          {change !== undefined && (
            <p className={`text-xs font-medium mt-1 flex items-center gap-1 ${
              change >= 0 ? "text-emerald-600" : "text-red-500"
            }`}>
              <TrendingUp className={`w-3 h-3 ${change < 0 ? "rotate-180" : ""}`} />
              {change >= 0 ? "+" : ""}{change}% this month
            </p>
          )}
        </div>
        <div className={`${bgColor} p-3 rounded-2xl`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      {/* Decorative gradient */}
      <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10"
        style={{ background: `radial-gradient(circle, currentColor 0%, transparent 70%)` }} />
    </Card>
  </motion.div>
);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const analytics = useSelector(selectDashboardAnalytics);
  const isLoading = useSelector(selectAnalyticsLoading);
  const resumes = useSelector(selectResumes);

  useEffect(() => {
    dispatch(fetchDashboardAnalytics(30));
    dispatch(fetchResumes({ limit: 5 }));
  }, [dispatch]);

  const overview = analytics?.overview || {};
  const topResumes = analytics?.topResumes || [];
  const templateDist = analytics?.templateDistribution || {};
  const dailyActivity = analytics?.dailyActivity || [];

  // Process chart data
  const activityChartData = (() => {
    const grouped = {};
    dailyActivity.forEach(({ _id, count }) => {
      const date = _id.date;
      if (!grouped[date]) grouped[date] = { date, views: 0, downloads: 0, edits: 0 };
      if (_id.eventType === "resume_view") grouped[date].views = count;
      if (_id.eventType === "resume_download") grouped[date].downloads = count;
      if (_id.eventType === "resume_edit") grouped[date].edits = count;
    });
    return Object.values(grouped).slice(-14);
  })();

  const templateChartData = Object.entries(templateDist).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const statCards = [
    {
      icon: FileText,
      label: "Total Resumes",
      value: overview.totalResumes || 0,
      change: 12,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      icon: Eye,
      label: "Total Views",
      value: overview.totalViews || 0,
      change: 24,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      icon: Download,
      label: "Downloads",
      value: overview.totalDownloads || 0,
      change: 8,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      icon: Target,
      label: "Avg ATS Score",
      value: `${overview.avgATSScore || 0}%`,
      change: 5,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  const quickActions = [
    { icon: Plus, label: "New Resume", desc: "Start from scratch", path: "/resumes/new", color: "gradient-bg text-white" },
    { icon: Sparkles, label: "AI Enhance", desc: "Improve existing resume", path: "/resumes", color: "bg-violet-50 text-violet-700" },
    { icon: Target, label: "ATS Check", desc: "Score your resume", path: "/resumes", color: "bg-cyan-50 text-cyan-700" },
    { icon: BarChart2, label: "Analytics", desc: "View performance", path: "/analytics", color: "bg-emerald-50 text-emerald-700" },
  ];

  if (isLoading && !analytics) {
    return <Loader fullScreen message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl gradient-bg-hero p-8 text-white"
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Avatar
                src={user?.profileImage?.url}
                firstName={user?.firstName}
                lastName={user?.lastName}
                size="lg"
              />
              <div>
                <p className="text-white/70 text-sm">Good morning,</p>
                <h1 className="text-2xl font-bold font-display">
                  {user?.firstName} {user?.lastName} 👋
                </h1>
              </div>
            </div>
            <p className="text-white/70 text-sm max-w-md">
              You have <strong className="text-white">{overview.totalResumes || 0} resume{overview.totalResumes !== 1 ? "s" : ""}</strong>.
              Your average ATS score is <strong className="text-white">{overview.avgATSScore || 0}%</strong>.
              Keep improving!
            </p>
          </div>
          <Button
            variant="secondary"
            icon={Plus}
            onClick={() => navigate("/resumes/new")}
            className="bg-white/20 text-white border-white/30 hover:bg-white/30 flex-shrink-0"
          >
            Create Resume
          </Button>
        </div>

        {/* Floating orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-10 right-20 w-40 h-40 rounded-full bg-cyan-300/10 blur-2xl" />
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <StatCard key={stat.label} {...stat} delay={idx * 0.08} />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map(({ icon: Icon, label, desc, path, color }, idx) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.06 }}
            >
              <Link to={path}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`${color} p-4 rounded-2xl cursor-pointer shadow-soft hover:shadow-medium transition-all`}
                >
                  <Icon className="w-6 h-6 mb-2" />
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs opacity-70 mt-0.5">{desc}</p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-slate-800">Resume Activity</h3>
                <p className="text-sm text-slate-500">Last 14 days</p>
              </div>
              <Badge variant="primary" size="sm">Live</Badge>
            </div>
            {activityChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={activityChartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="downloadsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                    labelStyle={{ fontWeight: 600, color: "#1e293b" }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2} fill="url(#viewsGrad)" name="Views" />
                  <Area type="monotone" dataKey="downloads" stroke="#06b6d4" strokeWidth={2} fill="url(#downloadsGrad)" name="Downloads" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <BarChart2 className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No activity yet. Create your first resume!</p>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Template Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="h-full">
            <h3 className="font-semibold text-slate-800 mb-1">Templates Used</h3>
            <p className="text-sm text-slate-500 mb-4">Your template distribution</p>
            {templateChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={templateChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {templateChartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span className="text-xs text-slate-600">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">No templates used yet</p>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Top Resumes + AI Tips Row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Top Resumes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Top Performing Resumes</h3>
              <Link to="/resumes" className="text-indigo-600 text-sm hover:text-indigo-700 flex items-center gap-1">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {topResumes.length > 0 ? topResumes.map((resume, idx) => (
                <Link key={resume._id} to={`/resumes/${resume._id}/edit`}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{resume.title}</p>
                      <p className="text-xs text-slate-500">{resume.analytics?.views || 0} views · {resume.analytics?.downloads || 0} downloads</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-sm font-bold" style={{ color: getATSColor(resume.atsScore?.overall || 0) }}>
                        {resume.atsScore?.overall || 0}%
                      </div>
                      <div className="text-xs text-slate-400">ATS</div>
                    </div>
                  </motion.div>
                </Link>
              )) : (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No resumes yet.</p>
                  <Link to="/resumes/new">
                    <Button variant="primary" size="sm" className="mt-3">Create First Resume</Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* AI Insights & Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-violet-50 rounded-xl">
                <Sparkles className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">AI Insights</h3>
                <p className="text-xs text-slate-500">Personalized recommendations</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                {
                  icon: "🎯",
                  title: "Optimize Keywords",
                  desc: "Add industry-specific keywords to increase ATS score by ~15%",
                  action: "Fix Now",
                  color: "indigo",
                },
                {
                  icon: "📊",
                  title: "Quantify Achievements",
                  desc: "Replace vague descriptions with metrics and numbers",
                  action: "Enhance",
                  color: "violet",
                },
                {
                  icon: "⚡",
                  title: "Add Skills Section",
                  desc: "Recruiters spend 6 seconds on skills — make it count",
                  action: "Add Skills",
                  color: "cyan",
                },
                {
                  icon: "🚀",
                  title: "Complete Your Profile",
                  desc: "Add a professional photo and LinkedIn URL",
                  action: "Update",
                  color: "emerald",
                },
              ].map(({ icon, title, desc, action, color }) => (
                <div key={title} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                  <span className="text-xl flex-shrink-0">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                  <button className={`text-xs font-medium text-${color}-600 hover:text-${color}-700 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity`}>
                    {action} →
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Resumes */}
      {resumes?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Recent Resumes</h2>
            <Link to="/resumes" className="text-indigo-600 text-sm hover:text-indigo-700 flex items-center gap-1 font-medium">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {resumes.slice(0, 4).map((resume, idx) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.06 }}
              >
                <Link to={`/resumes/${resume._id}/edit`}>
                  <Card hover className="group">
                    {/* Template preview placeholder */}
                    <div className="h-32 rounded-xl mb-3 overflow-hidden gradient-bg flex items-center justify-center relative">
                      <FileText className="w-10 h-10 text-white/40" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <Badge variant="dark" size="xs" className="bg-white/20 text-white capitalize">
                          {resume.template}
                        </Badge>
                        {resume.atsScore?.overall > 0 && (
                          <Badge
                            variant="dark"
                            size="xs"
                            className="bg-white/20 text-white"
                          >
                            {resume.atsScore.overall}% ATS
                          </Badge>
                        )}
                      </div>
                    </div>

                    <h3 className="font-semibold text-slate-800 text-sm truncate mb-1 group-hover:text-indigo-600 transition-colors">
                      {resume.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(resume.updatedAt)}
                    </p>

                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Eye className="w-3 h-3" /> {resume.analytics?.views || 0}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Download className="w-3 h-3" /> {resume.analytics?.downloads || 0}
                      </div>
                      {resume.isDraft && (
                        <Badge variant="warning" size="xs" className="ml-auto">Draft</Badge>
                      )}
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardPage;