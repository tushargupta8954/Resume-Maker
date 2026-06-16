import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Globe } from "lucide-react";
import {
  addLanguage, removeLanguage,
  selectActiveResumeData,
} from "../../../features/resume/resumeSlice.js";
import { createEmptyLanguage } from "../../../utils/helpers.js";
import { LANGUAGE_PROFICIENCY } from "../../../utils/constants.js";
import Button from "../../common/Button.jsx";

const proficiencyColors = {
  basic: "bg-slate-100 text-slate-600",
  conversational: "bg-blue-100 text-blue-700",
  proficient: "bg-indigo-100 text-indigo-700",
  fluent: "bg-violet-100 text-violet-700",
  native: "bg-emerald-100 text-emerald-700",
};

const LanguagesSection = () => {
  const dispatch = useDispatch();
  const resumeData = useSelector(selectActiveResumeData);
  const languages = resumeData?.languages || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Languages</h3>
          <p className="text-sm text-slate-500 mt-0.5">Languages you speak or write</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => dispatch(addLanguage(createEmptyLanguage()))}
        >
          Add Language
        </Button>
      </div>

      {languages.length === 0 ? (
        <div
          onClick={() => dispatch(addLanguage(createEmptyLanguage()))}
          className="border-2 border-dashed border-slate-200 hover:border-cyan-300 rounded-2xl p-8 text-center cursor-pointer transition-colors group"
        >
          <Globe className="w-10 h-10 text-slate-300 group-hover:text-cyan-400 mx-auto mb-3 transition-colors" />
          <p className="font-medium text-slate-600 group-hover:text-cyan-600 transition-colors">
            Add a Language
          </p>
          <p className="text-xs text-slate-400 mt-1">English, Spanish, French...</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {languages.map((lang) => (
              <motion.div
                key={lang.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3 p-4 bg-white rounded-2xl border-2 border-slate-100 hover:border-slate-200 transition-colors"
              >
                <Globe className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                <input
                  type="text"
                  value={lang.name || ""}
                  onChange={(e) => dispatch({ type: "resume/updateSection",
                    payload: { section: "languages", data: languages.map((l) =>
                      l.id === lang.id ? { ...l, name: e.target.value } : l
                    )}
                  })}
                  placeholder="Language name"
                  className="flex-1 text-sm font-medium text-slate-700 bg-transparent border-0 outline-none focus:outline-none placeholder:text-slate-400"
                />
                <select
                  value={lang.proficiency || "proficient"}
                  onChange={(e) => dispatch({ type: "resume/updateSection",
                    payload: { section: "languages", data: languages.map((l) =>
                      l.id === lang.id ? { ...l, proficiency: e.target.value } : l
                    )}
                  })}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border-0 font-medium cursor-pointer ${proficiencyColors[lang.proficiency || "proficient"]}`}
                >
                  {LANGUAGE_PROFICIENCY.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => dispatch(removeLanguage(lang.id))}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default LanguagesSection;