import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import Button from "../components/common/Button.jsx";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        {/* 404 graphic */}
        <div className="relative mb-8">
          <div className="text-[160px] font-black text-slate-100 leading-none select-none font-display">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-float">🔍</div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-800 mb-4 font-display">
          Page not found
        </h1>
        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard">
            <Button variant="primary" size="lg" icon={Home}>
              Go to Dashboard
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="lg"
            icon={ArrowLeft}
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;