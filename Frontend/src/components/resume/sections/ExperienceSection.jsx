import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, ChevronDown, ChevronUp,
  Sparkles, Briefcase, MapPin, Calendar,
  GripVertical, Check, X,
} from "lucide-react";
import {
  addExperience, updateExperience, removeExperience,
  selectActiveResumeData,
} from "../../../features/resume/resumeSlice.js";
import {
  enhanceExperience, selectExperienceLoading,
  selectEnhancedExperience, clearAIResults,
} from "../../../features/ai/aiSlice.js";
import { createEmptyExperience } from "../../../utils/helpers.js";
import Button from "../../common/Button.jsx";
import Input from "../../common/Input.jsx";
import Modal from "../../common/Modal.jsx";
import Badge from "../../common/Badge.jsx";

const ExperienceItem = ({ exp, index, onUpdate, onRemove }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectExperienceLoading);
  const enhanced = useSelector(selectEnhancedExperience);
  const [expanded, setExpanded] = useState(index === 0);
  const [showEnhanced, setShowEnhanced] = useState(false);
  const [newAchievement, setNewAchievement] = useState("");
  const [newTech, setNewTech] = useState("");

  const handleChange = (field) => (e) => {
    onUpdate(exp.id, { [field]: e.target.value });
  };

  const handleCheckbox = (field) => (e) => {
    onUpdate(exp.id, { [field]: e.target.checked });
  };

  const addAchievement = () => {
    if (!newAchievement.trim()) return;
    onUpdate(exp.id, {
      achievements: [...(exp.achievements || []), newAchievement.trim()],
    });
    setNewAchievement("");
  };

  const removeAchievement = (idx) => {
    onUpdate(exp.id, {
      achievements: exp.achievements.filter((_, i) => i !== idx),
    });
  };

  const addTech = () => {
    if (!newTech.trim()) return;
    onUpdate(exp.id, {
      technologies: [...(exp.technologies || []), newTech.trim()],
    });
    setNewTech("");
  };

  const removeTech = (idx) => {
    onUpdate(exp.id, {
      technologies: exp.technologies.filter((_, i) => i !== idx),
    });
  };

  const handleAIEnhance = () => {
    dispatch(enhanceExperience({
      description: exp.description,
      position: exp.position,
      company: exp.company,
      achievements: exp.achievements,
    }));
    setShowEnhanced(true);
  };

  const applyEnhanced = () => {
    if (enhanced) {
      onUpdate(exp.id, {
        description: enhanced.description || exp.description,
        achievements: enhanced.achievements || exp.achievements,
        aiEnhanced: true,
      });
    }
    dispatch(clearAIResults("experience"));
    setShowEnhanced(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="border-2 border-slate-100 hover:border-slate-200 rounded-2xl overflow-hidden transition-colors"
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer bg-white hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="text-slate-300 cursor-grab active:cursor-grabbing flex-shrink-0">
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-800 truncate">
              {exp.position || "New Position"}
            </p>
            {exp.aiEnhanced && <Badge variant="purple" size="xs">✨ AI Enhanced</Badge>}
          </div>
          <p className="text-xs text-slate-500 truncate">
            {exp.company || "Company Name"}
            {exp.company && exp.startDate && ` · ${exp.startDate} – ${exp.isCurrentRole ? "Present" : exp.endDate || "?"}`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(exp.id); }}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="text-slate-400">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded form */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-4 border-t border-slate-100 bg-slate-50/50">
              {/* Row 1: Position + Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                <Input
                  label="Job Title"
                  placeholder="Senior Software Engineer"
                  value={exp.position || ""}
                  onChange={handleChange("position")}
                  icon={Briefcase}
                  required
                />
                <Input
                  label="Company Name"
                  placeholder="TCS, Inc."
                  value={exp.company || ""}
                  onChange={handleChange("company")}
                  required
                />
              </div>

              {/* Row 2: Location */}
              <Input
                label="Location"
                placeholder="Pune, MH (or Remote)"
                value={exp.location || ""}
                onChange={handleChange("location")}
                icon={MapPin}
              />

              {/* Row 3: Dates */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Start Date"
                  type="month"
                  value={exp.startDate || ""}
                  onChange={handleChange("startDate")}
                  icon={Calendar}
                />
                <div>
                  <Input
                    label="End Date"
                    type="month"
                    value={exp.endDate || ""}
                    onChange={handleChange("endDate")}
                    icon={Calendar}
                    disabled={exp.isCurrentRole}
                  />
                </div>
              </div>

              {/* Current role checkbox */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exp.isCurrentRole || false}
                  onChange={handleCheckbox("isCurrentRole")}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700 font-medium">I currently work here</span>
              </label>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Job Description
                </label>
                <textarea
                  value={exp.description || ""}
                  onChange={(e) => onUpdate(exp.id, { description: e.target.value })}
                  placeholder="Briefly describe your responsibilities and impact..."
                  rows={3}
                  className="input-base resize-none"
                />
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Key Achievements
                </label>
                <div className="space-y-2">
                  <AnimatePresence>
                    {(exp.achievements || []).map((ach, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-start gap-2 p-2.5 bg-white rounded-xl border border-slate-100"
                      >
                        <span className="text-indigo-400 mt-0.5 flex-shrink-0">•</span>
                        <span className="flex-1 text-sm text-slate-700 leading-relaxed">{ach}</span>
                        <button
                          onClick={() => removeAchievement(idx)}
                          className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())}
                      placeholder="Add achievement (press Enter)"
                      className="input-base flex-1 text-sm"
                    />
                    <button
                      onClick={addAchievement}
                      className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Technologies Used
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <AnimatePresence>
                    {(exp.technologies || []).map((tech, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium"
                      >
                        {tech}
                        <button onClick={() => removeTech(idx)} className="hover:text-red-500 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                    placeholder="React, Node.js, AWS... (Enter)"
                    className="input-base flex-1 text-sm"
                  />
                  <button
                    onClick={addTech}
                    className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* AI Enhance button */}
              <Button
                variant="ai"
                size="sm"
                icon={Sparkles}
                isLoading={isLoading}
                onClick={handleAIEnhance}
                className="w-full"
              >
                Enhance with AI ✨
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Enhancement Modal */}
      <Modal
        isOpen={showEnhanced && !!enhanced}
        onClose={() => { setShowEnhanced(false); dispatch(clearAIResults("experience")); }}
        title="AI Enhancement Preview"
        size="lg"
      >
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2 p-3 bg-violet-50 rounded-xl border border-violet-100">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <p className="text-sm text-violet-700 font-medium">
              AI has enhanced your experience description and achievements.
            </p>
          </div>

          {enhanced?.description && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Enhanced Description</h4>
              <div className="p-3 bg-slate-50 rounded-xl text-sm text-slate-700 leading-relaxed border border-slate-100">
                {enhanced.description}
              </div>
            </div>
          )}

          {enhanced?.achievements?.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Enhanced Achievements</h4>
              <ul className="space-y-2">
                {enhanced.achievements.map((ach, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-indigo-400 mt-0.5 flex-shrink-0 font-bold">•</span>
                    <span className="text-sm text-slate-700 leading-relaxed">{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => { setShowEnhanced(false); dispatch(clearAIResults("experience")); }}>
              Keep Original
            </Button>
            <Button variant="primary" fullWidth icon={Check} onClick={applyEnhanced}>
              Apply Enhancement
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

const ExperienceSection = () => {
  const dispatch = useDispatch();
  const resumeData = useSelector(selectActiveResumeData);
  const experience = resumeData?.experience || [];

  const handleAdd = () => {
    dispatch(addExperience(createEmptyExperience()));
  };

  const handleUpdate = (id, data) => {
    dispatch(updateExperience({ id, data }));
  };

  const handleRemove = (id) => {
    dispatch(removeExperience(id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Work Experience</h3>
          <p className="text-sm text-slate-500 mt-0.5">Add your work history, starting with the most recent</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={handleAdd}>
          Add Job
        </Button>
      </div>

      {experience.length === 0 ? (
        <div
          onClick={handleAdd}
          className="border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-2xl p-8 text-center cursor-pointer transition-colors group"
        >
          <Briefcase className="w-10 h-10 text-slate-300 group-hover:text-indigo-400 mx-auto mb-3 transition-colors" />
          <p className="font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">Add Work Experience</p>
          <p className="text-xs text-slate-400 mt-1">Click to add your first job</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {experience.map((exp, index) => (
              <ExperienceItem
                key={exp.id}
                exp={exp}
                index={index}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default ExperienceSection;