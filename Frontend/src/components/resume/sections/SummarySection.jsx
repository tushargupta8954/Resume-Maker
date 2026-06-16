import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, Check, ChevronDown, Mic, MicOff } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

import { updateSummary, selectActiveResumeData } from "../../../features/resume/resumeSlice.js";
import { generateAISummary, selectSummaryLoading } from "../../../features/ai/aiSlice.js";
import Button from "../../common/Button.jsx";

const toneOptions = [
  { value: "professional", label: "Professional" },
  { value: "confident", label: "Confident" },
  { value: "creative", label: "Creative" },
  { value: "technical", label: "Technical" },
];

const SummarySection = () => {
  const dispatch = useDispatch();
  const resumeData = useSelector(selectActiveResumeData);
  const summaryLoading = useSelector(selectSummaryLoading);

  const [tone, setTone] = useState("professional");
  const [charCount, setCharCount] = useState(resumeData?.summary?.length || 0);
  const maxChars = 600;

  const { transcript, listening, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();

  const handleChange = (e) => {
    const val = e.target.value;
    if (val.length <= maxChars) {
      dispatch(updateSummary(val));
      setCharCount(val.length);
    }
  };

  const handleVoiceToggle = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      if (transcript) {
        const combined = (resumeData?.summary || "") + " " + transcript;
        dispatch(updateSummary(combined.trim()));
        resetTranscript();
      }
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleGenerateSummary = () => {
    const skills = resumeData?.skills?.map((s) => s.name) || [];
    const expYears = resumeData?.experience?.length > 0
      ? `${resumeData.experience.length}+ positions`
      : undefined;

    dispatch(generateAISummary({
      resumeId: resumeData?._id,
      jobTitle: resumeData?.personalInfo?.jobTitle,
      experience: expYears,
      skills: skills.slice(0, 8),
      tone,
    }));
  };

  const density = Math.round((charCount / maxChars) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Professional Summary</h3>
          <p className="text-sm text-slate-500 mt-0.5">A compelling overview of your career (2-4 sentences)</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Voice input */}
          {browserSupportsSpeechRecognition && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleVoiceToggle}
              className={`p-2 rounded-xl border-2 transition-all ${
                listening
                  ? "bg-red-50 border-red-300 text-red-600 animate-pulse"
                  : "border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
              title={listening ? "Stop recording" : "Start voice input"}
            >
              {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </motion.button>
          )}
        </div>
      </div>

      {/* Tone selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-500">Tone:</span>
        <div className="flex gap-1.5">
          {toneOptions.map((t) => (
            <button
              key={t.value}
              onClick={() => setTone(t.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                tone === t.value
                  ? "gradient-bg text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Voice indicator */}
      <AnimatePresence>
        {listening && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl"
          >
            <div className="flex gap-0.5">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-red-500 rounded-full"
                  animate={{ height: [4, 16, 4] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
            <span className="text-xs text-red-600 font-medium">Listening... speak your summary</span>
            {transcript && <span className="text-xs text-red-500 italic truncate flex-1">"{transcript}"</span>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={resumeData?.summary || ""}
          onChange={handleChange}
          placeholder="Write a compelling professional summary or use AI to generate one. Example: 'Results-driven Software Engineer with 5+ years of experience building scalable web applications...'"
          rows={5}
          className={`
            w-full resize-none input-base leading-relaxed
            ${charCount > maxChars * 0.9 ? "border-amber-300 focus:border-amber-400 focus:ring-amber-100" : ""}
          `}
        />
        {/* Character count */}
        <div className="absolute bottom-3 right-3 text-xs text-slate-400">
          <span className={charCount > maxChars * 0.9 ? "text-amber-500" : ""}>{charCount}</span>
          <span>/{maxChars}</span>
        </div>
      </div>

      {/* Density bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              density > 90 ? "bg-amber-400" : density > 50 ? "bg-indigo-500" : "bg-slate-300"
            }`}
            animate={{ width: `${density}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-xs text-slate-400 flex-shrink-0">
          {density < 30 ? "Too short" : density > 90 ? "Too long" : "Good length"}
        </span>
      </div>

      {/* AI Generate button */}
      <div className="flex gap-2">
        <Button
          variant="ai"
          icon={Sparkles}
          isLoading={summaryLoading}
          onClick={handleGenerateSummary}
          className="flex-1"
          size="sm"
        >
          {summaryLoading ? "Generating..." : "Generate with AI"}
        </Button>
        {resumeData?.summary && (
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={handleGenerateSummary}>
            Regenerate
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default SummarySection;