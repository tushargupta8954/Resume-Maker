import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  FaEye,
  FaDownload,
  FaEdit,
  FaTrash,
  FaCopy,
  FaShare,
  FaChartLine,
  FaFileAlt,
} from 'react-icons/fa';
import { deleteResume, duplicateResume } from '../../redux/slices/resumeSlice';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ResumeCard = ({ resume }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await dispatch(deleteResume(resume._id)).unwrap();
        toast.success('Resume deleted successfully');
      } catch (error) {
        toast.error('Failed to delete resume');
      }
    }
  };

  const handleDuplicate = async (e) => {
    e.stopPropagation();
    try {
      await dispatch(duplicateResume(resume._id)).unwrap();
      toast.success('Resume duplicated successfully');
    } catch (error) {
      toast.error('Failed to duplicate resume');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card card-hover cursor-pointer"
      onClick={() => navigate(`/builder/${resume._id}`)}
    >
      {/* Preview Image */}
      <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <FaFileAlt className="text-6xl" />
        </div>
      </div>

      {/* Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 truncate">{resume.title}</h3>
          <p className="text-sm text-gray-600">
            Updated {format(new Date(resume.updatedAt), 'MMM dd, yyyy')}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <FaEye />
            <span>{resume.viewCount || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaDownload />
            <span>{resume.downloadCount || 0}</span>
          </div>
          {resume.atsScore?.score && (
            <div className="flex items-center gap-1">
              <FaChartLine />
              <span className={getScoreColor(resume.atsScore.score)}>
                {resume.atsScore.score}%
              </span>
            </div>
          )}
        </div>

        {/* Template Badge */}
        <div className="flex items-center justify-between">
          <span className="px-2 py-1 bg-primary-100 text-primary-600 text-xs font-medium rounded capitalize">
            {resume.template}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/builder/${resume._id}`);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FaEdit />
            Edit
          </button>
          <button
            onClick={handleDuplicate}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Duplicate"
          >
            <FaCopy />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResumeCard;