import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, ChevronDown, ChevronUp,
  Rocket, Globe, Github, Sparkles, X,
} from "lucide-react";
import {
  addProject, updateProject, removeProject,
  selectActiveResumeData,
} from "../../../features/resume/resumeSlice.js";
import {
  generateProjectDescription,
  selectProjectLoading,
  selectProjectDescription,
  clearAIResults,
} from "../../../features/ai/aiSlice.js";
import { createEmptyProject } from "../../../utils/helpers.js";
import Button from "../../common/Button.jsx";
import Input from "../../common/Input.jsx";
import Badge from "../../common/Badge.jsx";
import Modal from "../../common/Modal.jsx";

const ProjectItem = ({ project, index, onUpdate, onRemove }) => {
  const dispatch = useDispatch();
  const projectLoading = useSelector(selectProjectLoading);
  const projectDescription = useSelector(selectProjectDescription);
  const [expanded, setExpanded] = useState(index === 0);
  const [newTech, setNewTech] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const [showAIResult, setShowAIResult] = useState(false);

  const handleChange = (field) => (e) => onUpdate(project.id, { [field]: e.target.value });

  const addTech = () => {
    if (!newTech.trim()) return;
    onUpdate(project.id, { technologies: [...(project.technologies || []), newTech.trim()] });
    setNewTech("");
  };

  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    onUpdate(project.id, { highlights: [...(project.highlights || []), newHighlight.trim()] });
    setNewHighlight("");
  };

  const handleAIGenerate = () => {
    dispatch(generateProjectDescription({
      projectName: project.name,
      technologies: project.technologies,
      role: "Developer",
      duration: `${project.startDate || ""} - ${project.endDate || "Present"}`,
      currentDescription: project.description || "",
      currentHighlights: project.highlights || [],
    }));
    setShowAIResult(true);
  };

  const applyAIResult = () => {
    if (projectDescription) {
      onUpdate(project.id, {
        description: projectDescription.description || projectDescription || project.description,
        highlights: projectDescription.highlights || project.highlights,
        aiEnhanced: true,
      });
    }
    dispatch(clearAIResults("project"));
    setShowAIResult(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="border-2 border-slate-100 hover:border-slate-200 rounded-2xl overflow-hidden transition-colors"
    >
      <div
        className="flex items-center gap-3 p-4 cursor-pointer bg-white hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
          <Rocket className="w-4 h-4 text-violet-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-800 truncate text-sm">
              {project.name || "New Project"}
            </p>
            {project.aiEnhanced && <Badge variant="purple" size="xs">✨ AI</Badge>}
          </div>
          {project.technologies?.length > 0 && (
            <p className="text-xs text-slate-500 truncate">
              {project.technologies.slice(0, 3).join(", ")}
              {project.technologies.length > 3 && ` +${project.technologies.length - 3} more`}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(project.id); }}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="text-slate-400">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-4 border-t border-slate-100 bg-slate-50/50">
              <div className="pt-4">
                <Input
                  label="Project Name"
                  placeholder="AI Resume Builder"
                  value={project.name || ""}
                  onChange={handleChange("name")}
                  icon={Rocket}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  value={project.description || ""}
                  onChange={(e) => onUpdate(project.id, { description: e.target.value })}
                  placeholder="Briefly describe what the project does and your role..."
                  rows={3}
                  className="input-base resize-none w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Live URL"
                  placeholder="https://myproject.com"
                  value={project.liveUrl || ""}
                  onChange={handleChange("liveUrl")}
                  icon={Globe}
                />
                <Input
                  label="GitHub URL"
                  placeholder="github.com/user/repo"
                  value={project.githubUrl || ""}
                  onChange={handleChange("githubUrl")}
                  icon={Github}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Start Date"
                  type="month"
                  value={project.startDate || ""}
                  onChange={handleChange("startDate")}
                />
                <Input
                  label="End Date"
                  type="month"
                  value={project.endDate || ""}
                  onChange={handleChange("endDate")}
                />
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Technologies
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <AnimatePresence>
                    {(project.technologies || []).map((tech, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 text-violet-700 rounded-lg text-xs font-medium border border-violet-100"
                      >
                        {tech}
                        <button
                          onClick={() => onUpdate(project.id, {
                            technologies: project.technologies.filter((_, i) => i !== idx),
                          })}
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
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                    placeholder="React, Node.js, MongoDB... (Enter)"
                    className="input-base flex-1 text-sm"
                  />
                  <button
                    onClick={addTech}
                    className="px-3 py-2 bg-violet-50 text-violet-600 rounded-xl hover:bg-violet-100 transition-colors text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Key Highlights
                </label>
                <div className="space-y-2 mb-2">
                  <AnimatePresence>
                    {(project.highlights || []).map((h, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-start gap-2 p-2.5 bg-white rounded-xl border border-slate-100"
                      >
                        <span className="text-violet-400 mt-0.5 flex-shrink-0">▸</span>
                        <span className="flex-1 text-sm text-slate-700">{h}</span>
                        <button
                          onClick={() => onUpdate(project.id, {
                            highlights: project.highlights.filter((_, i) => i !== idx),
                          })}
                          className="text-slate-300 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                    placeholder="Key achievement or feature (Enter)"
                    className="input-base flex-1 text-sm"
                  />
                  <button
                    onClick={addHighlight}
                    className="px-3 py-2 bg-violet-50 text-violet-600 rounded-xl hover:bg-violet-100 transition-colors text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              <Button
                variant="ai"
                size="sm"
                icon={Sparkles}
                isLoading={projectLoading}
                onClick={handleAIGenerate}
                className="w-full"
                disabled={!project.name}
              >
                Generate Description with AI
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Result Modal */}
      <Modal
        isOpen={showAIResult && !!projectDescription}
        onClose={() => { setShowAIResult(false); dispatch(clearAIResults("project")); }}
        title="AI Generated Project Description"
        size="md"
      >
        <div className="p-6 space-y-4">
          {/* Handle both string and object responses */}
          {typeof projectDescription === 'string' && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Generated Description</h4>
              <p className="text-sm text-slate-600 p-3 bg-slate-50 rounded-xl leading-relaxed">
                {projectDescription}
              </p>
            </div>
          )}
          
          {typeof projectDescription === 'object' && projectDescription && (
            <>
              {projectDescription.description && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Description</h4>
                  <p className="text-sm text-slate-600 p-3 bg-slate-50 rounded-xl leading-relaxed">
                    {projectDescription.description}
                  </p>
                </div>
              )}
              {projectDescription.highlights?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Highlights</h4>
                  <ul className="space-y-1.5">
                    {projectDescription.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 p-2.5 bg-slate-50 rounded-xl">
                        <span className="text-violet-500 flex-shrink-0 mt-0.5">▸</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => { setShowAIResult(false); dispatch(clearAIResults("project")); }}>
              Discard
            </Button>
            <Button variant="primary" fullWidth onClick={applyAIResult}>
              Apply to Project
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const dispatch = useDispatch();
  const resumeData = useSelector(selectActiveResumeData);
  const projects = resumeData?.projects || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Projects</h3>
          <p className="text-sm text-slate-500 mt-0.5">Showcase your best work and side projects</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => dispatch(addProject(createEmptyProject()))}
        >
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div
          onClick={() => dispatch(addProject(createEmptyProject()))}
          className="border-2 border-dashed border-slate-200 hover:border-violet-300 rounded-2xl p-8 text-center cursor-pointer transition-colors group"
        >
          <Rocket className="w-10 h-10 text-slate-300 group-hover:text-violet-400 mx-auto mb-3 transition-colors" />
          <p className="font-medium text-slate-600 group-hover:text-violet-600 transition-colors">
            Add a Project
          </p>
          <p className="text-xs text-slate-400 mt-1">Highlight your best work</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {projects.map((proj, index) => (
              <ProjectItem
                key={proj.id}
                project={proj}
                index={index}
                onUpdate={(id, data) => dispatch(updateProject({ id, data }))}
                onRemove={(id) => dispatch(removeProject(id))}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectsSection;