import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie,
  Cell, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import {
  Eye, Download, TrendingUp, Target, FileText,
  Calendar, BarChart2, Activity, Award, Zap,
} from "lucide-react";

import {
  fetchDashboardAnalytics, selectDashboardAnalytics,
  selectAnalyticsLoading, setSelectedPeriod, selectSelectedPeriod,
} from "../../features/analytics/analyticsSlice.js";
import { selectResumes } from "../../features/resume/resumeSlice.js";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Loader from "../../components/common/Loader.jsx";
import ProgressBar from "../../components/common/ProgressBar.jsx";
import { getATSColor, getATSLabel } from "../../utils/helpers.js";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];
const PERIODS = [
  { value: 7, label: "7 Days" },
  { value: 30, label: "30 Days" },
  { value: 90, label: "90 Days" },
];

const MetricCard = ({ icon: Icon, label, value, subValue, color, bgColor, trend, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
    <Card hover>
      <div className="flex items-center justify-between mb-3">
        <div className={`${bgColor} p-3 rounded-2xl`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        {trend !== undefined && (
          <Badge variant={trend >= 0 ? "success" : "danger"} size="xs">
            {trend >= 0 ? "+" : ""}{trend}%
          </Badge>
        )}
      </div>
      <p className="text-3xl font-black font-display text-slate-800">{value}</p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
      {subValue && <p className="text-xs text-slate-400 mt-0.5">{subValue}</p>}
    </Card>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-strong p-3 text-sm">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-600">{entry.name}:</span>
          <span className="font-semibold text-slate-800">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const analytics = useSelector(selectDashboardAnalytics);
  const isLoading = useSelector(selectAnalyticsLoading);
  const period = useSelector(selectSelectedPeriod);
  const resumes = useSelector(selectResumes);

  useEffect(() => {
    dispatch(fetchDashboardAnalytics(period));
  }, [dispatch, period]);

  const overview = analytics?.overview || {};
  const topResumes = analytics?.topResumes || [];
  const templateDist = analytics?.templateDistribution || {};
  const dailyActivity = analytics?.dailyActivity || [];
  const eventBreakdown = analytics?.eventBreakdown || [];

  // Process data
  const activityData = (() => {
    const grouped = {};
    dailyActivity.forEach(({ _id, count }) => {
      const date = _id.date;
      if (!grouped[date]) grouped[date] = { date, views: 0, downloads: 0, edits: 0 };
      if (_id.eventType === "resume_view") grouped[date].views = count;
      if (_id.eventType === "resume_download") grouped[date].downloads = count;
      if (_id.eventType === "resume_edit") grouped[date].edits = count;
    });
    return Object.values(grouped);
  })();

  const templateData = Object.entries(templateDist).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    percentage: Math.round((value / Object.values(templateDist).reduce((a, b) => a + b, 0)) * 100),
  }));

  const eventData = eventBreakdown.map(({ _id, count }) => ({
    name: _id?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    count,
  }));

  const radarData = [
    { subject: "Views", A: overview.totalViews || 0, fullMark: 100 },
    { subject: "Downloads", A: overview.totalDownloads || 0, fullMark: 100 },
    { subject: "ATS Score", A: overview.avgATSScore || 0, fullMark: 100 },
    { subject: "Resumes", A: (overview.totalResumes || 0) * 10, fullMark: 100 },
    { subject: "Engagement", A: 65, fullMark: 100 },
  ];

  if (isLoading && !analytics) {
    return <Loader fullScreen message="Loading analytics..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Track your resume performance and insights</p>
        </motion.div>

        {/* Period selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {PERIODS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => dispatch(setSelectedPeriod(value))}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                period === value
                  ? "bg-white text-slate-800 shadow-soft"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={FileText} label="Total Resumes" value={overview.totalResumes || 0}
          color="text-indigo-600" bgColor="bg-indigo-50" trend={12} delay={0} />
        <MetricCard icon={Eye} label="Total Views" value={overview.totalViews || 0}
          color="text-violet-600" bgColor="bg-violet-50" trend={24} delay={0.06} />
        <MetricCard icon={Download} label="Downloads" value={overview.totalDownloads || 0}
          color="text-cyan-600" bgColor="bg-cyan-50" trend={8} delay={0.12} />
        <MetricCard icon={Target} label="Avg ATS Score" value={`${overview.avgATSScore || 0}%`}
          subValue={getATSLabel(overview.avgATSScore || 0)}
          color="text-emerald-600" bgColor="bg-emerald-50" trend={5} delay={0.18} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2"
        >
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-slate-800">Activity Over Time</h3>
                <p className="text-xs text-slate-500 mt-0.5">Views, downloads and edits</p>
              </div>
              <Badge variant="primary" size="sm">
                <Activity className="w-3 h-3" /> Live
              </Badge>
            </div>
            {activityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={activityData} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
                  <defs>
                    {[
                      { id: "views", color: "#6366f1" },
                      { id: "downloads", color: "#06b6d4" },
                      { id: "edits", color: "#10b981" },
                    ].map(({ id, color }) => (
                      <linearGradient key={id} id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
                  <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2} fill="url(#grad-views)" name="Views" />
                  <Area type="monotone" dataKey="downloads" stroke="#06b6d4" strokeWidth={2} fill="url(#grad-downloads)" name="Downloads" />
                  <Area type="monotone" dataKey="edits" stroke="#10b981" strokeWidth={2} fill="url(#grad-edits)" name="Edits" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[240px] flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <BarChart2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No activity data yet</p>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Template Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full">
            <h3 className="font-semibold text-slate-800 mb-1">Template Usage</h3>
            <p className="text-xs text-slate-500 mb-4">Distribution of templates</p>
            {templateData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={templateData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                      {templateData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {templateData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-xs text-slate-600 flex-1">{item.name}</span>
                      <span className="text-xs font-semibold text-slate-700">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-slate-400">
                <p className="text-xs">No templates used</p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Event Breakdown Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card>
            <h3 className="font-semibold text-slate-800 mb-1">Activity Breakdown</h3>
            <p className="text-xs text-slate-500 mb-4">Events by type</p>
            {eventData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={eventData} margin={{ top: 5, right: 5, bottom: 40, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9, fill: "#94a3b8" }}
                    tickLine={false}
                    angle={-35}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Events" radius={[6, 6, 0, 0]}>
                    {eventData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-slate-400">
                <p className="text-xs">No events recorded</p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Performance Radar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <h3 className="font-semibold text-slate-800 mb-1">Performance Overview</h3>
            <p className="text-xs text-slate-500 mb-4">Multi-dimensional analysis</p>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#64748b" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <Radar name="Performance" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Top Resumes Table */}
      {topResumes.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card padding="none">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Top Performing Resumes</h3>
              <p className="text-xs text-slate-500 mt-0.5">Ranked by total views</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-50">
                    {["#", "Resume", "Template", "Views", "Downloads", "ATS Score", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topResumes.map((resume, i) => (
                    <motion.tr
                      key={resume._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="w-6 h-6 rounded-lg gradient-bg text-white text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-sm text-slate-800 truncate max-w-[180px]">{resume.title}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="default" size="xs" className="capitalize">{resume.template}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-slate-700">{resume.analytics?.views || 0}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-slate-700">{resume.analytics?.downloads || 0}</span>
                      </td>
                      <td className="px-4 py-3">
                        {resume.atsScore?.overall > 0 ? (
                          <div className="flex items-center gap-2">
                            <ProgressBar value={resume.atsScore.overall} max={100} size="sm" color="dynamic"
                              showPercentage={false} animated={false} className="w-16" />
                            <span className="text-xs font-bold" style={{ color: getATSColor(resume.atsScore.overall) }}>
                              {resume.atsScore.overall}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Not scored</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={resume.isPublic ? "success" : "default"} size="xs" dot>
                          {resume.isPublic ? "Public" : "Private"}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}

      {/* AI Usage stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="gradient-bg text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-5 h-5 text-yellow-300" />
                <h3 className="font-semibold text-lg">AI Usage Summary</h3>
              </div>
              <p className="text-white/70 text-sm">Your AI feature usage this month</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Summaries", value: eventBreakdown.find(e => e._id === "ai_summary")?.count || 0 },
                { label: "ATS Checks", value: eventBreakdown.find(e => e._id === "ats_check")?.count || 0 },
                { label: "Enhancements", value: eventBreakdown.find(e => e._id === "ai_enhance")?.count || 0 },
              ].map(({ label, value }) => (
                <div key={label} className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <p className="text-2xl font-black font-display">{value}</p>
                  <p className="text-xs text-white/70 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;