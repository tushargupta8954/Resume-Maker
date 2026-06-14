import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchResumes, fetchResume, createResume, updateResume,
  deleteResume, duplicateResume, toggleArchiveResume,
  loadResumeForEdit, resetActiveResume, setTemplate,
  setColorScheme, reorderSections, markSaved,
  selectResumes, selectCurrentResume, selectActiveResumeData,
  selectResumeLoading, selectResumeSaving, selectUnsavedChanges,
} from "../features/resume/resumeSlice.js";
import { exportToPDF, getResumeFilename } from "../utils/pdfExport.js";
import { resumeService } from "../services/resumeService.js";
import toast from "react-hot-toast";

const useResume = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resumes = useSelector(selectResumes);
  const currentResume = useSelector(selectCurrentResume);
  const activeResumeData = useSelector(selectActiveResumeData);
  const isLoading = useSelector(selectResumeLoading);
  const isSaving = useSelector(selectResumeSaving);
  const unsavedChanges = useSelector(selectUnsavedChanges);

  const loadResumes = (params) => dispatch(fetchResumes(params));

  const loadResume = async (id) => {
    const result = await dispatch(fetchResume(id));
    if (fetchResume.fulfilled.match(result)) {
      dispatch(loadResumeForEdit(result.payload.data.resume));
      return result.payload.data.resume;
    }
    return null;
  };

  const saveResume = async (id) => {
    if (id && id !== "new") {
      const result = await dispatch(updateResume({ id, data: activeResumeData }));
      if (updateResume.fulfilled.match(result)) {
        dispatch(markSaved());
        return result.payload.data.resume;
      }
    } else {
      const result = await dispatch(createResume(activeResumeData));
      if (createResume.fulfilled.match(result)) {
        dispatch(markSaved());
        const newResume = result.payload.data.resume;
        navigate(`/resumes/${newResume._id}/edit`, { replace: true });
        return newResume;
      }
    }
    return null;
  };

  const removeResume = async (id) => {
    const result = await dispatch(deleteResume(id));
    return deleteResume.fulfilled.match(result);
  };

  const cloneResume = async (id) => {
    const result = await dispatch(duplicateResume(id));
    return duplicateResume.fulfilled.match(result);
  };

  const archiveResume = (id) => dispatch(toggleArchiveResume(id));

  const changeTemplate = (template) => dispatch(setTemplate(template));

  const changeColorScheme = (colors) => dispatch(setColorScheme(colors));

  const reorder = (newOrder) => dispatch(reorderSections(newOrder));

  const newResume = () => {
    dispatch(resetActiveResume());
    navigate("/resumes/new");
  };

  const exportResumePDF = async (resumeData) => {
    const toastId = toast.loading("Generating PDF...");
    try {
      const filename = getResumeFilename(resumeData);
      await exportToPDF("resume-preview", filename);
      if (resumeData?._id) await resumeService.trackDownload(resumeData._id);
      toast.success("PDF downloaded!", { id: toastId });
      return true;
    } catch {
      toast.error("PDF export failed.", { id: toastId });
      return false;
    }
  };

  return {
    resumes,
    currentResume,
    activeResumeData,
    isLoading,
    isSaving,
    unsavedChanges,
    loadResumes,
    loadResume,
    saveResume,
    removeResume,
    cloneResume,
    archiveResume,
    changeTemplate,
    changeColorScheme,
    reorder,
    newResume,
    exportResumePDF,
  };
};

export default useResume;