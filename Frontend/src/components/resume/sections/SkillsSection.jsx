import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Sparkles, Zap } from "lucide-react";

import {
  addSkill, removeSkill, updateSkill,
  selectActiveResumeData,
} from "../../../features/resume/resumeSlice.js";
import {
  getSuggestedSkills, selectSuggestedSkills, selectSkillsLoading,
} from "../../../features/ai/aiSlice.js";
import { createEmptySkill } from "../../../utils/helpers.js";
import { SKILL_LEVELS } from "../../../utils/constants.js";
import Button from "../../common/Button.jsx";
import Badge from "../../common/Badge.jsx";

const SKILL_CATEGORIES = ["Technical", "Soft Skills", "Tools", "Languages", "Frameworks", "Databases", "Cloud", "Other"];

const SkillsSection = () => {
  const dispatch = useDispatch();
  const resumeData = useSelector(selectActiveResumeData);
  const suggestedSkills = useSelector(selectSuggestedSkills);
  const skillsLoading = useSelector(selectSkillsLoading);

  const skills = resumeData?.skills || [];
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("intermediate");
  const [newSkillCategory, setNewSkillCategory] = useState("Technical");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    dispatch(addSkill({
      ...createEmptySkill(),
      name: newSkillName.trim(),
      level: newSkillLevel,
      category: newSkillCategory,
    }));
    setNewSkillName("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); handleAddSkill(); }
  };

  const handleRemove = (id) => dispatch(removeSkill(id));

  const handleLevelChange = (id, level) => dispatch(updateSkill({ id, data: { level } }));

  const handleAddSuggested = (skillName) => {
    if (skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) return;
    dispatch(addSkill({ ...createEmptySkill(), name: skillName, level: "intermediate", category: "Technical" }));
  };

  const handleSuggestSkills = () => {
    dispatch(getSuggestedSkills({
      jobRole: resumeData?.personalInfo?.jobTitle || resumeData?.targetJobRole,
      currentSkills: skills.map((s) => s.name),
      experienceLevel: "mid-level",
    }));
    setShowSuggestions(true);
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const filteredSkills = activeCategory === "all"
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  const levelColors = {
    beginner: "bg-slate-100 text-slate-600",
    intermediate: "bg-blue-100 text-blue-700",
    advanced: "bg-indigo-100 text-indigo-700",
    expert: "bg-violet-100 text-violet-700",
  };

  const allSuggestedSkills = suggestedSkills
    ? [
        ...(suggestedSkills.technical || []),
        ...(suggestedSkills.tools || []),
        ...(suggestedSkills.industry || []),
        ...(suggestedSkills.trending || []),
      ]
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Skills</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {skills.length} skill{skills.length !== 1 ? "s" : ""} added
          </p>
        </div>
        <Button
          variant="ai"
          size="sm"
          icon={Sparkles}
          isLoading={skillsLoading}
          onClick={handleSuggestSkills}
        >
          Suggest Skills
        </Button>
      </div>

      {/* Add skill input */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Skill name (press Enter to add)"
            className="input-base flex-1"
          />
          <button
            onClick={handleAddSkill}
            disabled={!newSkillName.trim()}
            className="px-4 py-2 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Level & Category selectors */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Level</label>
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
              className="input-base text-sm w-full"
            >
              {SKILL_LEVELS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value)}
              className="input-base text-sm w-full"
            >
              {SKILL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <AnimatePresence>
        {showSuggestions && allSuggestedSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-violet-50 rounded-2xl border border-violet-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-semibold text-violet-800">AI Suggested Skills</span>
              </div>
              <button onClick={() => setShowSuggestions(false)} className="text-violet-400 hover:text-violet-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {allSuggestedSkills.map((skill) => {
                const alreadyAdded = skills.some((s) => s.name.toLowerCase() === skill.toLowerCase());
                return (
                  <motion.button
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => !alreadyAdded && handleAddSuggested(skill)}
                    disabled={alreadyAdded}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      alreadyAdded
                        ? "bg-violet-200 text-violet-500 cursor-not-allowed"
                        : "bg-white border-2 border-violet-200 text-violet-700 hover:border-violet-400 hover:bg-violet-50"
                    }`}
                  >
                    {alreadyAdded ? "✓ " : "+ "}{skill}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills list */}
      {skills.length > 0 && (
        <div>
          {/* Category filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {["all", ...Object.keys(skillsByCategory)].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  activeCategory === cat
                    ? "gradient-bg text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat === "all" ? `All (${skills.length})` : `${cat} (${skillsByCategory[cat]?.length})`}
              </button>
            ))}
          </div>

          {/* Skills grid */}
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {filteredSkills.map((skill) => (
                <motion.div
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group flex items-center gap-2 pl-3 pr-2 py-2 bg-white rounded-xl border-2 border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <span className="text-sm font-medium text-slate-700">{skill.name}</span>

                  {/* Level selector on hover */}
                  <select
                    value={skill.level}
                    onChange={(e) => handleLevelChange(skill.id, e.target.value)}
                    className={`text-xs px-1.5 py-0.5 rounded-lg border-0 font-medium cursor-pointer ${levelColors[skill.level]}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {SKILL_LEVELS.map((l) => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleRemove(skill.id)}
                    className="text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SkillsSection;