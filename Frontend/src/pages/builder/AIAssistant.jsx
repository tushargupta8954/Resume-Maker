import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaTimes, FaMagic, FaChartLine, FaLightbulb } from 'react-icons/fa';
import { toggleAIAssistant } from '../../redux/slices/uiSlice';
import { getSuggestions } from '../../redux/slices/aiSlice';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const AIAssistant = () => {
  const dispatch = useDispatch();
  const { currentResume } = useSelector((state) => state.resume);
  const { suggestions } = useSelector((state) => state.ai);
  const [loading, setLoading] = useState(false);

  const handleGetSuggestions = async () => {
    setLoading(true);
    try {
      await dispatch(getSuggestions({ resumeId: currentResume._id })).unwrap();
      toast.success('Suggestions loaded!');
    } catch (error) {
      toast.error('Failed to get suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FaMagic className="text-2xl text-primary-600" />
            <h2 className="text-xl font-bold">AI Assistant</h2>
          </div>
          <button
            onClick={() => dispatch(toggleAIAssistant())}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FaTimes />
          </button>
        </div>

        {/* Get Suggestions Button */}
        <Button
          icon={FaLightbulb}
          onClick={handleGetSuggestions}
          isLoading={loading}
          fullWidth
          className="mb-6"
        >
          Get AI Suggestions
        </Button>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Improvement Suggestions</h3>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  suggestion.priority === 'high'
                    ? 'bg-red-50 border-red-500'
                    : suggestion.priority === 'medium'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      suggestion.priority === 'high'
                        ? 'bg-red-200 text-red-800'
                        : suggestion.priority === 'medium'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-blue-200 text-blue-800'
                    }`}
                  >
                    {suggestion.priority.toUpperCase()}
                  </span>
                  <span className="font-medium text-sm">{suggestion.section}</span>
                </div>
                <p className="text-sm text-gray-700">{suggestion.suggestion}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quick Tips */}
        <div className="mt-8 p-4 bg-primary-50 rounded-lg">
          <h4 className="font-semibold text-primary-900 mb-3">💡 Quick Tips</h4>
          <ul className="space-y-2 text-sm text-primary-800">
            <li>• Use action verbs to start bullet points</li>
            <li>• Quantify achievements with numbers</li>
            <li>• Keep your resume to 1-2 pages</li>
            <li>• Tailor your resume for each job</li>
            <li>• Proofread for spelling and grammar</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default AIAssistant;