import { motion } from "framer-motion";

const Loader = ({
  size = "md",
  fullScreen = false,
  message = "Loading...",
  variant = "spinner",
}) => {
  const sizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const Spinner = () => (
    <div className={`${sizes[size]} relative`}>
      <div
        className={`${sizes[size]} rounded-full border-2 border-indigo-100 border-t-indigo-500 animate-spin`}
      />
    </div>
  );

  const DotsLoader = () => (
    <div className="flex gap-1.5 items-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-indigo-500"
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  const LogoLoader = () => (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-lg"
        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-white text-2xl font-bold font-display">R</span>
      </motion.div>
      <DotsLoader />
      {message && (
        <p className="text-slate-500 text-sm font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-50/90 backdrop-blur-sm flex items-center justify-center z-50">
        <LogoLoader />
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <DotsLoader />
        {message && <p className="text-slate-500 text-sm">{message}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <Spinner />
      {message && <p className="text-slate-500 text-sm">{message}</p>}
    </div>
  );
};

export default Loader;