import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Tooltip component
 *
 * Props:
 *  content   {string | ReactNode}
 *  position  {"top"|"bottom"|"left"|"right"}
 *  delay     {number}  ms before showing (default 400)
 *  children  {ReactNode}
 *  className {string}
 */
const Tooltip = ({
  content,
  position = "top",
  delay = 400,
  children,
  className = "",
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const show = () => {
    if (disabled || !content) return;
    timerRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timerRef.current);
    setVisible(false);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  // Arrow + position styles
  const positionClasses = {
    top:    "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left:   "right-full top-1/2 -translate-y-1/2 mr-2",
    right:  "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top:    "top-full left-1/2 -translate-x-1/2 border-t-slate-800 border-x-transparent border-b-transparent border-4",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 border-x-transparent border-t-transparent border-4",
    left:   "left-full top-1/2 -translate-y-1/2 border-l-slate-800 border-y-transparent border-r-transparent border-4",
    right:  "right-full top-1/2 -translate-y-1/2 border-r-slate-800 border-y-transparent border-l-transparent border-4",
  };

  const variants = {
    top:    { initial: { opacity: 0, y: 4 },  animate: { opacity: 1, y: 0 } },
    bottom: { initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0 } },
    left:   { initial: { opacity: 0, x: 4 },  animate: { opacity: 1, x: 0 } },
    right:  { initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0 } },
  };

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            role="tooltip"
            initial={variants[position].initial}
            animate={variants[position].animate}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute z-50 pointer-events-none
              ${positionClasses[position]}
            `}
          >
            {/* Bubble */}
            <div className="relative bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap max-w-[200px] text-center">
              {content}
              {/* Arrow */}
              <span className={`absolute w-0 h-0 border ${arrowClasses[position]}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;