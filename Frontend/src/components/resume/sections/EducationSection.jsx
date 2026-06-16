import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, ChevronDown, ChevronUp,
  GraduationCap, MapPin, Calendar, X,
} from "lucide-react";
import {
  addEducation, updateEducation, removeEducation,
  selectActiveResumeData,
} from "../../../features/resume/resumeSlice.js";
import { createEmptyEducation } from "../../../utils/helpers.js";
import Button from "../../common/Button.jsx";
import Input from "../../common/Input.jsx";

const EducationItem = ({ edu, index, onUpdate, onRemove }) => {
  const [expanded, setExpanded] = useState(index === 0);
  const [newCourse, setNewCourse] = useState("");

  const handleChange = (field) => (e) =>
    onUpdate(edu.id, { [field]: e.target.value });

  const addCourse = () => {
    if (!newCourse.trim()) return;
    onUpdate(edu.id, {
      relevantCourses: [...(edu.relevantCourses || []), newCourse.trim()],
    });
    setNewCourse("");
  };

  const removeCourse = (idx) =>
    onUpdate(edu.id, {
      relevantCourses: edu.relevantCourses.filter((_, i) => i !== idx),
    });

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
        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 truncate text-sm">
            {edu.degree || "Degree / Program"}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {edu.institution || "Institution Name"}
            {edu.startDate && ` · ${edu.startDate} – ${edu.endDate || "?"}`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(edu.id); }}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="text-slate-400">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                <Input
                  label="Degree / Certificate"
                  placeholder="Bachelor of Science"
                  value={edu.degree || ""}
                  onChange={handleChange("degree")}
                  required
                />
                <Input
                  label="Field of Study"
                  placeholder="Computer Science"
                  value={edu.field || ""}
                  onChange={handleChange("field")}
                />
              </div>

              <Input
                label="Institution Name"
                placeholder="Indian Institute of Technology Kanpur"
                value={edu.institution || ""}
                onChange={handleChange("institution")}
                icon={GraduationCap}
                required
              />

              <Input
                label="Location"
                placeholder="Kanpur, UP"
                value={edu.location || ""}
                onChange={handleChange("location")}
                icon={MapPin}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Start Date"
                  type="month"
                  value={edu.startDate || ""}
                  onChange={handleChange("startDate")}
                  icon={Calendar}
                />
                <Input
                  label="End Date"
                  type="month"
                  value={edu.endDate || ""}
                  onChange={handleChange("endDate")}
                  icon={Calendar}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="GPA (optional)"
                  placeholder="3.8 / 4.0"
                  value={edu.gpa || ""}
                  onChange={handleChange("gpa")}
                />
                <Input
                  label="Honors / Awards"
                  placeholder="Magna Cum Laude"
                  value={edu.honors || ""}
                  onChange={handleChange("honors")}
                />
              </div>

              {/* Relevant Courses */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Relevant Courses
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <AnimatePresence>
                    {(edu.relevantCourses || []).map((course, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium border border-emerald-100"
                      >
                        {course}
                        <button
                          onClick={() => removeCourse(idx)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCourse())}
                    placeholder="Data Structures, ML, Web Dev... (Enter)"
                    className="input-base flex-1 text-sm"
                  />
                  <button
                    onClick={addCourse}
                    className="px-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const EducationSection = () => {
  const dispatch = useDispatch();
  const resumeData = useSelector(selectActiveResumeData);
  const education = resumeData?.education || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Education</h3>
          <p className="text-sm text-slate-500 mt-0.5">Degrees, diplomas, and certifications</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => dispatch(addEducation(createEmptyEducation()))}
        >
          Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <div
          onClick={() => dispatch(addEducation(createEmptyEducation()))}
          className="border-2 border-dashed border-slate-200 hover:border-emerald-300 rounded-2xl p-8 text-center cursor-pointer transition-colors group"
        >
          <GraduationCap className="w-10 h-10 text-slate-300 group-hover:text-emerald-400 mx-auto mb-3 transition-colors" />
          <p className="font-medium text-slate-600 group-hover:text-emerald-600 transition-colors">
            Add Education
          </p>
          <p className="text-xs text-slate-400 mt-1">Click to add your first degree</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {education.map((edu, index) => (
              <EducationItem
                key={edu.id}
                edu={edu}
                index={index}
                onUpdate={(id, data) => dispatch(updateEducation({ id, data }))}
                onRemove={(id) => dispatch(removeEducation(id))}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default EducationSection;