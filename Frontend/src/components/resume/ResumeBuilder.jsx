import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext, closestCenter, KeyboardSensor,
  PointerSensor, useSensor, useSensors,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical, ChevronDown, ChevronRight, Settings2,
  Eye, EyeOff, Save, Sparkles, CheckCircle,
} from "lucide-react";

import {
  selectActiveResumeData, reorderSections,
  updateResume, createResume, markSaved,
  selectResumeSaving, selectUnsavedChanges, selectLastSaved,
} from "../../features/resume/resumeSlice.js";
import { SECTION_ICONS } from "../../utils/constants.js";
import Button from "../common/Button.jsx";
import Badge from "../common/Badge.jsx";

// Section components
import PersonalInfoSection from "./sections/PersonalInfoSection.jsx";
import SummarySection from "./sections/SummarySection.jsx";
import ExperienceSection from "./sections/ExperienceSection.jsx";
import SkillsSection from "./sections/SkillsSection.jsx";
import EducationSection from "./sections/EducationSection.jsx";
import ProjectsSection from "./sections/ProjectsSection.jsx";
import CertificationsSection from "./sections/CertificationsSection.jsx";
import LanguagesSection from "./sections/LanguagesSection.jsx";

const sectionComponents = {
  summary: SummarySection,
  experience: ExperienceSection,
  education: EducationSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  certifications: CertificationsSection,
  languages: LanguagesSection,
};

const sectionLabels = {
  summary: "Professional Summary",
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  languages: "Languages",
  awards: "Awards & Honors",
};

// Draggable Section Item
const SortableSectionItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className={`rounded-2xl border-2 transition-all ${isDragging ? "border-indigo-300 shadow-strong bg-white" : "border-transparent"}`}>
        <div className="flex items-center">
          <div
            {...listeners}
            className="px-3 py-4 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0"
          >
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

// Collapsible Section Wrapper
const CollapsibleSection = ({ sectionKey, title, isOpen, onToggle, children }) => {
  const Icon = SECTION_ICONS[sectionKey];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
      {/* Section header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
      >
        <span className="text-lg flex-shrink-0">{SECTION_ICONS[sectionKey] || "📋"}</span>
        <span className="font-semibold text-slate-800 flex-1">{title}</span>
        <div className="text-slate-400 flex-shrink-0 transition-transform" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-slate-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ResumeBuilder = ({ resumeId, onPreviewToggle, showPreview }) => {
  const dispatch = useDispatch();
  const resumeData = useSelector(selectActiveResumeData);
  const isSaving = useSelector(selectResumeSaving);
  const unsavedChanges = useSelector(selectUnsavedChanges);
  const lastSaved = useSelector(selectLastSaved);

  const [openSections, setOpenSections] = useState({
    personalInfo: true,
    summary: true,
    experience: true,
    education: false,
    skills: true,
    projects: false,
    certifications: false,
    languages: false,
  });

  const [sectionOrder, setSectionOrder] = useState(
    resumeData?.sectionOrder || ["summary", "experience", "education", "skills", "projects", "certifications", "languages"]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = sectionOrder.indexOf(active.id);
      const newIndex = sectionOrder.indexOf(over.id);
      const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
      setSectionOrder(newOrder);
      dispatch(reorderSections(newOrder));
    }
  };

  const handleSave = useCallback(async () => {
    const saveData = { ...resumeData };

    if (resumeId && resumeId !== "new") {
      await dispatch(updateResume({ id: resumeId, data: saveData }));
    } else {
      await dispatch(createResume(saveData));
    }
    dispatch(markSaved());
  }, [dispatch, resumeData, resumeId]);

  // Auto-save every 2 minutes
  useEffect(() => {
    if (!unsavedChanges) return;
    const timer = setInterval(() => {
      if (resumeId && resumeId !== "new") {
        handleSave();
      }
    }, 120000);
    return () => clearInterval(timer);
  }, [unsavedChanges, handleSave, resumeId]);

  const lastSavedText = lastSaved
    ? `Saved ${new Date(lastSaved).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : "Not saved yet";

  return (
    <div className="h-full flex flex-col">
      {/* Builder Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="font-semibold text-slate-800 text-sm">Resume Editor</h2>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              {unsavedChanges ? (
                <><span className="w-1.5 h-1.5 bg-amber-400 rounded-full inline-block" /> Unsaved changes</>
              ) : (
                <><CheckCircle className="w-3 h-3 text-emerald-500" /> {lastSavedText}</>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview toggle (mobile) */}
          <button
            onClick={onPreviewToggle}
            className={`lg:hidden p-2 rounded-xl border-2 transition-colors ${
              showPreview ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "border-slate-200 text-slate-500"
            }`}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Save button */}
          <Button
            variant={unsavedChanges ? "primary" : "secondary"}
            size="sm"
            icon={Save}
            isLoading={isSaving}
            onClick={handleSave}
          >
            {isSaving ? "Saving..." : unsavedChanges ? "Save" : "Saved"}
          </Button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Personal Info (always first, not draggable) */}
        <CollapsibleSection
          sectionKey="personalInfo"
          title="Personal Information"
          isOpen={openSections.personalInfo}
          onToggle={() => toggleSection("personalInfo")}
        >
          <PersonalInfoSection />
        </CollapsibleSection>

        {/* Draggable sections */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {sectionOrder.map((sectionKey) => {
                const SectionComponent = sectionComponents[sectionKey];
                if (!SectionComponent) return null;

                return (
                  <SortableSectionItem key={sectionKey} id={sectionKey}>
                    <CollapsibleSection
                      sectionKey={sectionKey}
                      title={sectionLabels[sectionKey] || sectionKey}
                      isOpen={openSections[sectionKey] || false}
                      onToggle={() => toggleSection(sectionKey)}
                    >
                      <SectionComponent />
                    </CollapsibleSection>
                  </SortableSectionItem>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default ResumeBuilder;