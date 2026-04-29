import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  FaPlus,
  FaFileAlt,
  FaEye,
  FaDownload,
  FaChartLine,
  FaStar,
} from 'react-icons/fa';
import { getResumes, createResume } from '../../redux/slices/resumeSlice';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ResumeCard from '../../components/dashboard/ResumeCard';
import StatsCard from '../../components/dashboard/StatsCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { resumes, isLoading } = useSelector((state) => state.resume);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    dispatch(getResumes());
  }, [dispatch]);

  const handleCreateResume = async () => {
    setCreating(true);
    try {
      const result = await dispatch(
        createResume({
          title: 'Untitled Resume',
        })
      ).unwrap();

      toast.success('Resume created successfully!');
      navigate(`/builder/${result._id}`);
    } catch (error) {
      toast.error('Failed to create resume');
    } finally {
      setCreating(false);
    }
  };

  const stats = [
    {
      title: 'Total Resumes',
      value: user?.resumeCount || 0,
      icon: FaFileAlt,
      color: 'blue',
      change: '+2 this month',
    },
    {
      title: 'Total Views',
      value: resumes.reduce((acc, r) => acc + (r.viewCount || 0), 0),
      icon: FaEye,
      color: 'green',
      change: '+15%',
    },
    {
      title: 'Downloads',
      value: resumes.reduce((acc, r) => acc + (r.downloadCount || 0), 0),
      icon: FaDownload,
      color: 'purple',
      change: '+8%',
    },
    {
      title: 'Avg ATS Score',
      value: resumes.length > 0
        ? Math.round(
            resumes.reduce((acc, r) => acc + (r.atsScore?.score || 0), 0) /
              resumes.length
          )
        : 0,
      icon: FaChartLine,
      color: 'orange',
      change: '+5 points',
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Here's what's happening with your resumes today
            </p>
          </div>
          <Button icon={FaPlus} onClick={handleCreateResume} isLoading={creating}>
            Create New Resume
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Recent Resumes */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Resumes</h2>
            <Button
              variant="outline"
              onClick={() => navigate('/resumes')}
            >
              View All
            </Button>
          </div>

          {resumes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card text-center py-16"
            >
              <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No resumes yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first resume and start landing interviews
              </p>
              <Button icon={FaPlus} onClick={handleCreateResume} isLoading={creating}>
                Create Your First Resume
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.slice(0, 6).map((resume, index) => (
                <motion.div
                  key={resume._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ResumeCard resume={resume} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card card-hover cursor-pointer"
            onClick={() => navigate('/builder')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <FaPlus className="text-primary-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Create Resume</h3>
                <p className="text-sm text-gray-600">Start from scratch</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card card-hover cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">ATS Check</h3>
                <p className="text-sm text-gray-600">Optimize your resume</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card card-hover cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaStar className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                <p className="text-sm text-gray-600">Get AI suggestions</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;