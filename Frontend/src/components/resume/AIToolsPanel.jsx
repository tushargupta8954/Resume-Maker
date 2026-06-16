import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Target, Zap, Search, FileSearch,
  ChevronRight, X, Check, Copy, RotateCcw,
  TrendingUp, AlertCircle, CheckCircle, Info,
} from "lucide-react";

import {
  getATSScore, customizeResumeForJob, optimizeKeywords,
  getImprovementTips, selectATSScore, selectJobCustomization,
  selectKeywordOptimization, selectImprovementTips,
  selectATSLoading, selectJobLoading, selectKeywordsLoading,
  selectTipsLoading,
} from "../../features/ai/aiSlice.js";
import { selectCurrentResume, selectActiveResumeData } from "../../features/resume/resumeSlice.js";
import Button from "../common/Button.jsx";
import Badge from "../common/Badge.jsx";
import ProgressBar from "../common/ProgressBar.jsx";
import { getATSColor, getATSLabel, copyToClipboard } from "../../utils/helpers.js";

const tools = [
  { id: "ats", label: "ATS Checker", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50", desc: "Score your resume" },
  { id: "job", label: "Job Match", icon: FileSearch, color: "text-blue-600", bg: "bg-blue-50", desc: "Customize for a role" },
  { id: "keywords", label: "Keywords", icon: Search, color: "text-violet-600", bg: "bg-violet-50", desc: "Optimize keywords" },
  { id: "tips", label: "Tips", icon: Sparkles, color: "text-amber-600", bg: "bg-amber-50", desc: "Improvement tips" },
];

/* ── ATS Tool ──────────────────────────────────────── */
const ATSTool = ({ resumeId }) => {
  const dispatch = useDispatch();
  const atsScore = useSelector(selectATSScore);
  const isLoading = useSelector(selectATSLoading);
  const [jobDesc, setJobDesc] = useState("");

  const handleCheck = () =>
    dispatch(getATSScore({ resumeId, jobDescription: jobDesc }));

  const atsColor = getATSColor(atsScore?.overall || 0);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Analyze how well your resume performs against Applicant Tracking Systems.
      </p>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Job Description (optional — improves accuracy)
        </label>
        <textarea
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          placeholder="Paste the job description here to get a targeted ATS score..."
          rows={4}
          className="input-base resize-none w-full text-sm"
        />
      </div>

      <Button
        variant="primary"
        fullWidth
        icon={Target}
        isLoading={isLoading}
        onClick={handleCheck}
      >
        Analyze ATS Score
      </Button>

      <AnimatePresence>
        {atsScore && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Overall score */}
            <div
              className="p-5 rounded-2xl text-center border-2"
              style={{ borderColor: `${atsColor}30`, backgroundColor: `${atsColor}08` }}
            >
              <div className="text-5xl font-black font-display mb-1" style={{ color: atsColor }}>
                {atsScore.overall}
              </div>
              <div className="text-sm font-semibold" style={{ color: atsColor }}>
                {getATSLabel(atsScore.overall)} ATS Score
              </div>
              <p className="text-xs text-slate-500 mt-1">out of 100 points</p>
            </div>

            {/* Section scores */}
            <div className="space-y-3">
              {Object.entries(atsScore.sections || {}).map(([key, val]) => (
                <ProgressBar
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={val}
                  max={100}
                  color="dynamic"
                  size="md"
                />
              ))}
            </div>

            {/* Keywords */}
            {atsScore.keywords && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Keywords</h4>
                {atsScore.keywords.found?.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-emerald-600 font-medium mb-1.5">
                      ✓ Found ({atsScore.keywords.found.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {atsScore.keywords.found.map((kw) => (
                        <Badge key={kw} variant="success" size="xs">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {atsScore.keywords.missing?.length > 0 && (
                  <div>
                    <p className="text-xs text-red-500 font-medium mb-1.5">
                      ✗ Missing ({atsScore.keywords.missing.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {atsScore.keywords.missing.map((kw) => (
                        <Badge key={kw} variant="danger" size="xs">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Improvements */}
            {atsScore.improvements?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">
                  🎯 How to Improve
                </h4>
                <ul className="space-y-2">
                  {atsScore.improvements.map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-slate-600 p-2.5 bg-amber-50 rounded-xl border border-amber-100"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Job Match Tool ────────────────────────────────── */
const JobMatchTool = ({ resumeId }) => {
  const dispatch = useDispatch();
  const customization = useSelector(selectJobCustomization);
  const isLoading = useSelector(selectJobLoading);
  const [form, setForm] = useState({ jobTitle: "", companyName: "", jobDescription: "" });

  const handleSubmit = () => {
    dispatch(customizeResumeForJob({ resumeId, ...form }));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Get AI recommendations to customize your resume for a specific job posting.
      </p>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Title</label>
          <input
            type="text"
            placeholder="Senior Product Manager"
            value={form.jobTitle}
            onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
            className="input-base w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name</label>
          <input
            type="text"
            placeholder="Google, Microsoft..."
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            className="input-base w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            placeholder="Paste the full job description here..."
            value={form.jobDescription}
            onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
            className="input-base resize-none w-full text-sm"
          />
        </div>
      </div>

      <Button
        variant="primary"
        fullWidth
        icon={FileSearch}
        isLoading={isLoading}
        disabled={!form.jobDescription}
        onClick={handleSubmit}
      >
        Analyze Job Match
      </Button>

      <AnimatePresence>
        {customization && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Match score */}
            {customization.customizationScore !== undefined && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                <div className="text-4xl font-black text-blue-600 font-display">
                  {customization.customizationScore}%
                </div>
                <p className="text-sm text-blue-700 font-medium mt-1">Job Match Score</p>
              </div>
            )}

            {customization.overallMatch && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-600 leading-relaxed">{customization.overallMatch}</p>
              </div>
            )}

            {customization.priorityActions?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">🚀 Priority Actions</h4>
                <ol className="space-y-2">
                  {customization.priorityActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2.5 p-2.5 bg-indigo-50 rounded-xl border border-indigo-100">
                      <span className="w-5 h-5 rounded-full gradient-bg text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-xs text-slate-700 leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {customization.keywordsToAdd?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Keywords to Add</h4>
                <div className="flex flex-wrap gap-2">
                  {customization.keywordsToAdd.map((kw) => (
                    <Badge key={kw} variant="primary" size="sm">{kw}</Badge>
                  ))}
                </div>
              </div>
            )}

            {customization.missingElements?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Missing Elements</h4>
                <ul className="space-y-1.5">
                  {customization.missingElements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <X className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {customization.summaryRewrite && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-slate-700">Suggested Summary</h4>
                  <button
                    onClick={() => copyToClipboard(customization.summaryRewrite)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <p className="text-xs text-slate-600 p-3 bg-slate-50 rounded-xl leading-relaxed border border-slate-100">
                  {customization.summaryRewrite}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Keywords Tool ─────────────────────────────────── */
const KeywordsTool = ({ resumeId }) => {
  const dispatch = useDispatch();
  const optimization = useSelector(selectKeywordOptimization);
  const isLoading = useSelector(selectKeywordsLoading);
  const [industry, setIndustry] = useState("");

  const handleOptimize = () =>
    dispatch(optimizeKeywords({ resumeId, industry }));

  const priorityColors = {
    high: "border-red-200 bg-red-50 text-red-700",
    medium: "border-amber-200 bg-amber-50 text-amber-700",
    low: "border-slate-200 bg-slate-50 text-slate-600",
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Identify and add high-impact keywords to pass ATS filters.
      </p>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Industry</label>
        <input
          type="text"
          placeholder="Software Engineering, Marketing..."
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="input-base w-full"
        />
      </div>

      <Button
        variant="primary"
        fullWidth
        icon={Search}
        isLoading={isLoading}
        onClick={handleOptimize}
      >
        Analyze Keywords
      </Button>

      <AnimatePresence>
        {optimization && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {optimization.suggestedKeywords?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">
                  💡 Suggested Keywords
                </h4>
                <div className="space-y-2">
                  {optimization.suggestedKeywords.map((item, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border text-xs ${priorityColors[item.priority] || priorityColors.low}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{item.keyword}</span>
                        <Badge
                          variant={item.priority === "high" ? "danger" : item.priority === "medium" ? "warning" : "default"}
                          size="xs"
                        >
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="opacity-80">{item.context}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {optimization.optimizedPhrases?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">
                  ✏️ Phrase Improvements
                </h4>
                <ul className="space-y-2">
                  {optimization.optimizedPhrases.map((phrase, i) => (
                    <li key={i} className="text-xs text-slate-600 p-2.5 bg-slate-50 rounded-xl border border-slate-100 leading-relaxed">
                      {phrase}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {optimization.actionVerbs?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">
                  ⚡ Power Action Verbs
                </h4>
                <div className="flex flex-wrap gap-2">
                  {optimization.actionVerbs.map((verb) => (
                    <button
                      key={verb}
                      onClick={() => copyToClipboard(verb)}
                      className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-100"
                    >
                      {verb}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Tips Tool ─────────────────────────────────────── */
const TipsTool = ({ resumeId }) => {
  const dispatch = useDispatch();
  const tips = useSelector(selectImprovementTips);
  const isLoading = useSelector(selectTipsLoading);

  const impactColors = {
    high: "text-red-600 bg-red-50 border-red-100",
    medium: "text-amber-600 bg-amber-50 border-amber-100",
    low: "text-slate-600 bg-slate-50 border-slate-100",
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Get personalized AI tips to make your resume stand out.
      </p>

      <Button
        variant="primary"
        fullWidth
        icon={Sparkles}
        isLoading={isLoading}
        onClick={() => dispatch(getImprovementTips({ resumeId }))}
      >
        Get Improvement Tips
      </Button>

      <AnimatePresence>
        {tips && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {tips.nextStep && (
              <div className="p-4 gradient-bg rounded-2xl">
                <p className="text-xs font-semibold text-white/80 mb-1">⚡ Top Priority</p>
                <p className="text-sm text-white font-medium leading-relaxed">{tips.nextStep}</p>
              </div>
            )}

            {tips.quickWins?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">🏆 Quick Wins</h4>
                <div className="space-y-2">
                  {tips.quickWins.map((win, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border text-xs ${impactColors[win.impact] || impactColors.low}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{win.tip}</span>
                        <div className="flex gap-1">
                          <Badge variant={win.impact === "high" ? "danger" : "warning"} size="xs">
                            {win.impact} impact
                          </Badge>
                          <Badge variant="default" size="xs">{win.effort} effort</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tips.contentImprovements?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">📝 Content</h4>
                <ul className="space-y-1.5">
                  {tips.contentImprovements.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tips.missingInformation?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">❌ Missing Info</h4>
                <div className="flex flex-wrap gap-2">
                  {tips.missingInformation.map((item) => (
                    <Badge key={item} variant="warning" size="sm">{item}</Badge>
                  ))}
                </div>
              </div>
            )}

            {tips.estimatedImprovement && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {tips.estimatedImprovement}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Main Panel ────────────────────────────────────── */
const AIToolsPanel = ({ resumeId, onClose }) => {
  const [activeTool, setActiveTool] = useState("ats");
  const currentResume = useSelector(selectCurrentResume);
  const id = resumeId || currentResume?._id;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-bg rounded-xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">AI Tools</h3>
            <p className="text-[10px] text-slate-400">Powered by Gemini AI</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tool tabs */}
      <div className="grid grid-cols-4 gap-1 p-3 border-b border-slate-100 shrink-0">
        {tools.map(({ id, label, icon: Icon, color, bg, desc }) => (
          <button
            key={id}
            onClick={() => setActiveTool(id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-center transition-all ${
              activeTool === id
                ? `${bg} ring-2 ring-offset-1 ring-indigo-300`
                : "hover:bg-slate-50"
            }`}
          >
            <div className={`p-1.5 rounded-lg ${activeTool === id ? bg : "bg-slate-100"}`}>
              <Icon className={`w-3.5 h-3.5 ${activeTool === id ? color : "text-slate-400"}`} />
            </div>
            <span className={`text-[10px] font-medium leading-tight ${activeTool === id ? color : "text-slate-500"}`}>
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Tool content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTool === "ats" && <ATSTool resumeId={id} />}
            {activeTool === "job" && <JobMatchTool resumeId={id} />}
            {activeTool === "keywords" && <KeywordsTool resumeId={id} />}
            {activeTool === "tips" && <TipsTool resumeId={id} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIToolsPanel;