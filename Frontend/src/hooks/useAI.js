import { useDispatch, useSelector } from "react-redux";
import {
  generateAISummary, enhanceExperience, getSuggestedSkills,
  getATSScore, customizeResumeForJob, optimizeKeywords,
  generateProjectDescription, getImprovementTips,
  selectGeneratedSummary, selectEnhancedExperience,
  selectSuggestedSkills, selectATSScore, selectJobCustomization,
  selectKeywordOptimization, selectImprovementTips,
  selectSummaryLoading, selectExperienceLoading,
  selectSkillsLoading, selectATSLoading, selectJobLoading,
  selectKeywordsLoading, selectTipsLoading, selectAIUsage,
  clearAIResults, clearAllAI,
} from "../features/ai/aiSlice.js";

const useAI = () => {
  const dispatch = useDispatch();

  const results = {
    summary: useSelector(selectGeneratedSummary),
    experience: useSelector(selectEnhancedExperience),
    skills: useSelector(selectSuggestedSkills),
    atsScore: useSelector(selectATSScore),
    jobCustomization: useSelector(selectJobCustomization),
    keywords: useSelector(selectKeywordOptimization),
    tips: useSelector(selectImprovementTips),
  };

  const loading = {
    summary: useSelector(selectSummaryLoading),
    experience: useSelector(selectExperienceLoading),
    skills: useSelector(selectSkillsLoading),
    ats: useSelector(selectATSLoading),
    job: useSelector(selectJobLoading),
    keywords: useSelector(selectKeywordsLoading),
    tips: useSelector(selectTipsLoading),
    any: Object.values({
      summary: useSelector(selectSummaryLoading),
      experience: useSelector(selectExperienceLoading),
      skills: useSelector(selectSkillsLoading),
      ats: useSelector(selectATSLoading),
      job: useSelector(selectJobLoading),
      keywords: useSelector(selectKeywordsLoading),
      tips: useSelector(selectTipsLoading),
    }).some(Boolean),
  };

  const usage = useSelector(selectAIUsage);

  return {
    results,
    loading,
    usage,
    generateSummary: (data) => dispatch(generateAISummary(data)),
    enhanceExp: (data) => dispatch(enhanceExperience(data)),
    suggestSkills: (data) => dispatch(getSuggestedSkills(data)),
    checkATS: (data) => dispatch(getATSScore(data)),
    matchJob: (data) => dispatch(customizeResumeForJob(data)),
    optimizeKw: (data) => dispatch(optimizeKeywords(data)),
    generateProject: (data) => dispatch(generateProjectDescription(data)),
    getTips: (data) => dispatch(getImprovementTips(data)),
    clearResult: (feature) => dispatch(clearAIResults(feature)),
    clearAll: () => dispatch(clearAllAI()),
  };
};

export default useAI;