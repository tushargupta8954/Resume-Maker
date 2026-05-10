import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaRocket,
  FaMagic,
  FaChartLine,
  FaFileAlt,
  FaCheckCircle,
  FaStar,
} from 'react-icons/fa';
import Button from '../components/common/Button';

const Landing = () => {
  const features = [
    {
      icon: FaMagic,
      title: 'AI-Powered Generation',
      description: 'Generate professional summaries and enhance descriptions with AI',
    },
    {
      icon: FaChartLine,
      title: 'ATS Optimization',
      description: 'Get real-time ATS scores and improvement suggestions',
    },
    {
      icon: FaFileAlt,
      title: 'Multiple Templates',
      description: 'Choose from modern, professional templates',
    },
    {
      icon: FaCheckCircle,
      title: 'Live Preview',
      description: 'See changes in real-time with instant preview',
    },
  ];

  return (
    <div className="min-h-screen  bg-gradient-to-br from-indigo-100
       via-white to-indigo-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaRocket className="text-3xl text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">ResumeAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Build Your Perfect Resume
            <span className="block text-primary-800 mt-2">with AI Power</span>
          </h1>
          <p className="text-m text-gray-600 mb-8 max-w-2xl mx-auto">
            Create professional, ATS-friendly resumes in minutes with AI assistance.
            <br/>Stand out from the crowd and land your dream job.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" icon={FaRocket}>
                Start Building Free
              </Button>
            </Link>
            <Button variant="outline" size="">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
            <div>
              <div className="text-4xl font-bold text-primary-800">10K+</div>
              <div className="text-gray-600 mt-2">Resumes Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-800">95%</div>
              <div className="text-gray-600 mt-2">ATS Pass Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-800">4.9</div>
              <div className="text-gray-600 mt-2 flex items-center justify-center gap-1">
                <FaStar className="text-yellow-400" />
                Rating
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to create a standout resume
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <feature.icon className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className=" bg-gradient-to-br from-indigo-400
       via-white to-indigo-800   text-gray-800 py-20 mx-10 rounded-2xl mb-10 ">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90 text-gray-500">
            Join thousands of job seekers who landed their dream jobs
          </p>
          <Link to="/register">
            <Button
              size="large"
              className="bg-white text-primary-800 hover:bg-gray-100"
            >
              Create Your Resume Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="h-50 bg-gradient-to-br mt-30 from-gray-800
       via-gray-600 to-gray-800 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 ResumeAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;