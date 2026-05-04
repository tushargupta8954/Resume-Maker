import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { getResumes, createResume } from '../../redux/slices/resumeSlice';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import ResumeCard from '../../components/dashboard/ResumeCard';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const ResumeList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { resumes, isLoading } = useSelector((state) => state.resume);
  const [searchQuery, setSearchQuery] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    dispatch(getResumes());
  }, [dispatch]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const result = await dispatch(createResume({ title: 'Untitled Resume' })).unwrap();
      toast.success('Resume created!');
      navigate(`/builder/${result._id}`);
    } catch (error) {
      toast.error('Failed to create resume');
    } finally {
      setCreating(false);
    }
  };

  const filteredResumes = resumes.filter((resume) =>
    resume.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-gray-600 mt-1">
              {resumes.length} {resumes.length === 1 ? 'resume' : 'resumes'}
            </p>
          </div>
          <Button icon={FaPlus} onClick={handleCreate} isLoading={creating}>
            Create New Resume
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resumes..."
            className="input pl-10"
          />
        </div>

        {/* Resumes Grid */}
        {filteredResumes.length === 0 ? (
          <div className="text-center py-16 card">
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'No resumes found' : 'No resumes yet'}
            </p>
            <Button icon={FaPlus} onClick={handleCreate} isLoading={creating}>
              Create Your First Resume
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume, index) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ResumeCard resume={resume} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResumeList;