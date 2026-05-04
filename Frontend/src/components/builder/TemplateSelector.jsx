import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentResume } from '../../redux/slices/resumeSlice';
import { FaTimes, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

const TemplateSelector = ({ onClose }) => {
  const dispatch = useDispatch();
  const { currentResume } = useSelector((state) => state.resume);

  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and contemporary design',
      preview: '/templates/modern-preview.png',
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional and professional',
      preview: '/templates/classic-preview.png',
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and elegant',
      preview: '/templates/minimal-preview.png',
    },
  ];

  const handleSelect = (templateId) => {
    dispatch(updateCurrentResume({ template: templateId }));
    toast.success('Template changed successfully!');
    onClose();
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
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Choose Template</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FaTimes />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                  currentResume.template === template.id
                    ? 'border-primary-600 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelect(template.id)}
              >
                {currentResume.template === template.id && (
                  <div className="absolute top-2 right-2 bg-primary-600 text-white rounded-full p-1">
                    <FaCheck />
                  </div>
                )}
                <div className="aspect-[8.5/11] bg-gray-100 rounded-t-lg flex items-center justify-center">
                  <span className="text-gray-400">Preview</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TemplateSelector;