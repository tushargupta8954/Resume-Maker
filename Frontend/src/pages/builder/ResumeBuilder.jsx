import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  FaSave,
  FaDownload,
  FaEye,
  FaRobot,
  FaMicrophone,
  FaChartLine,
  FaCog,
} from 'react-icons/fa';
import { getResume, updateResume } from '../../redux/slices/resumeSlice';
import { toggleAIAssistant, setPreviewMode } from '../../redux/slices/uiSlice';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ResumeEditor from '../../components/builder/ResumeEditor';
import ResumePreview from '../../components/builder/ResumePreview';
import AIAssistant from '../../components/builder/AIAssistant';
import TemplateSelector from '../../components/builder/TemplateSelector';
import ATSChecker from '../../components/builder/ATSChecker';
import toast from 'react-hot-toast';
import { exportToPDF } from '../../utils/pdfExport';

const ResumeBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentResume, isLoading } = useSelector((state) => state.resume);
  const { showAIAssistant, previewMode } = useSelector((state) => state.ui);

  const [saving, setSaving] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showATS, setShowATS] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getResume(id));
    } else {
      navigate('/dashboard');
    }
  }, [id, dispatch, navigate]);

  // Auto-save functionality
  useEffect(() => {
    if (currentResume && autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    if (currentResume) {
      const timer = setTimeout(() => {
        handleSave(true);
      }, 3000); // Auto-save after 3 seconds of inactivity

      setAutoSaveTimer(timer);
    }

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [currentResume]);

  const handleSave = async (isAutoSave = false) => {
    if (!currentResume) return;

    setSaving(true);
    try {
      await dispatch(
        updateResume({
          id: currentResume._id,
          data: currentResume,
        })
      ).unwrap();

      if (!isAutoSave) {
        toast.success('Resume saved successfully!');
      }
    } catch (error) {
      if (!isAutoSave) {
        toast.error('Failed to save resume');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!currentResume) return;

    try {
      await exportToPDF(currentResume);
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  if (isLoading || !currentResume) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <div>
                <input
                  type="text"
                  value={currentResume.title}
                  onChange={(e) =>
                    dispatch(
                      updateCurrentResume({ title: e.target.value })
                    )
                  }
                  className="text-xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2"
                />
                <p className="text-sm text-gray-500">
                  {saving ? 'Saving...' : 'All changes saved'}
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="small"
                icon={FaCog}
                onClick={() => setShowTemplates(!showTemplates)}
              >
                Template
              </Button>

              <Button
                variant="outline"
                size="small"
                icon={FaChartLine}
                onClick={() => setShowATS(!showATS)}
              >
                ATS Score
              </Button>

              <Button
                variant="outline"
                size="small"
                icon={FaRobot}
                onClick={() => dispatch(toggleAIAssistant())}
              >
                AI Assistant
              </Button>

              <Button
                variant="outline"
                size="small"
                icon={FaEye}
                onClick={() => dispatch(setPreviewMode(!previewMode))}
              >
                {previewMode ? 'Edit' : 'Preview'}
              </Button>

              <Button
                size="small"
                icon={FaSave}
                onClick={() => handleSave(false)}
                isLoading={saving}
              >
                Save
              </Button>

              <Button
                variant="success"
                size="small"
                icon={FaDownload}
                onClick={handleDownload}
              >
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Editor Panel */}
        {!previewMode && (
          <div className="w-1/2 overflow-y-auto p-6 border-r border-gray-200">
            <ResumeEditor resume={currentResume} />
          </div>
        )}

        {/* Preview Panel */}
        <div className={`${previewMode ? 'w-full' : 'w-1/2'} overflow-y-auto bg-gray-100 p-6`}>
          <div className="max-w-[8.5in] mx-auto">
            <ResumePreview resume={currentResume} />
          </div>
        </div>
      </div>

      {/* AI Assistant Sidebar */}
      {showAIAssistant && <AIAssistant />}

      {/* Template Selector Modal */}
      {showTemplates && (
        <TemplateSelector onClose={() => setShowTemplates(false)} />
      )}

      {/* ATS Checker Modal */}
      {showATS && <ATSChecker onClose={() => setShowATS(false)} />}
    </div>
  );
};

export default ResumeBuilder;