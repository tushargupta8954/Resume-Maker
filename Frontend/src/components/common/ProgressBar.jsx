import { motion } from "framer-motion";

const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showPercentage = true,
  color = "primary",
  size = "md",
  animated = true,
  className = "",
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colors = {
    primary: "from-indigo-500 to-violet-500",
    success: "from-emerald-400 to-green-500",
    warning: "from-amber-400 to-orange-500",
    danger: "from-red-400 to-rose-500",
    info: "from-sky-400 to-blue-500",
    purple: "from-purple-400 to-violet-500",
    dynamic:
      percentage >= 80
        ? "from-emerald-400 to-green-500"
        : percentage >= 60
        ? "from-blue-400 to-indigo-500"
        : percentage >= 40
        ? "from-amber-400 to-orange-500"
        : "from-red-400 to-rose-500",
  };

  const sizes = {
    xs: "h-1",
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
    xl: "h-6",
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-slate-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-slate-700">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full ${sizes[size]} bg-slate-100 rounded-full overflow-hidden`}
      >
        <motion.div
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full`}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;