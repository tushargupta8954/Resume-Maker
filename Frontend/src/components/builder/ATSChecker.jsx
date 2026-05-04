import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaTimes, FaChartLine } from 'react-icons/fa';
import { checkATS } from '../../redux/slices/aiSlice';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const ATSChecker = ({ onClose }) => {
  const dispatch = useDispatch();
  const { currentResume } = useSelector((state) => state.resume);
  const { atsScore } = useSelector((state) => state.ai);
  const [jobDescription, setJobDescription] = useState('');
  const [checking, setChecking] = useState(false);

  const handleCheck = async () => {
    setChecking(true);
    try {
      await dispatch(
        checkATS({
          resumeId: currentResume._id,
          jobDescription,
        })
      ).unwrap();
      toast.success('ATS check completed!');
    } catch (error) {
      toast.error('Failed to check ATS score');
    } finally {
      setChecking(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FaChartLine className="text-2xl text-primary-600" />
              <h2 className="text-2xl font-bold">ATS Compatibility Checker</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FaTimes />
            </button>
          </div>

          {/* Job Description Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description (Optional)
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here to get a more accurate ATS score..."
              rows={6}
              className="input resize-none"
            />
            <p className="text-sm text-gray-500 mt-2">
              Providing a job description helps optimize your resume for specific roles
            </p>
          </div>

          <Button
            icon={FaChartLine}
            onClick={handleCheck}
            isLoading={checking}
            fullWidth
            className="mb-6"
          >
            Check ATS Score
          </Button>

          {/* Results */}
          {atsScore && (
            <div className="space-y-6">
              {/* Score Display */}
              <div className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBg(
                    atsScore.score
                  )}`}
                >
                  <span
                    className={`text-5xl font-bold ${getScoreColor(
                      atsScore.score
                    )}`}
                  >
                    {atsScore.score}
                  </span>
                </div>
                <p className="text-gray-600 mt-4">Your ATS Compatibility Score</p>
              </div>

              {/* Feedback */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Improvement Suggestions
                </h3>
                <ul className="space-y-2">
                  {atsScore.feedback.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="text-primary-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Keywords */}
              {atsScore.keywords && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-900 mb-2">
                      ✓ Matched Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {atsScore.keywords.matched.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-900 mb-2">
                      ✗ Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {atsScore.keywords.missing.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ATSChecker;