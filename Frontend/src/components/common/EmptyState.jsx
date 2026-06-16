import { motion } from "framer-motion";
import Button from "./Button.jsx";

const EmptyState = ({
  icon: Icon,
  emoji,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      {/* Icon/Emoji */}
      <div className="mb-5">
        {emoji && (
          <span className="text-6xl mb-2 block animate-float">{emoji}</span>
        )}
        {Icon && !emoji && (
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center mx-auto border border-indigo-100">
            <Icon className="w-10 h-10 text-indigo-400" />
          </div>
        )}
      </div>

      {/* Text */}
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-500 text-sm max-w-md leading-relaxed mb-6">
          {description}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {actionLabel && onAction && (
          <Button variant="primary" onClick={onAction} size="md">
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="secondary" onClick={onSecondaryAction} size="md">
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default EmptyState;