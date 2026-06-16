import { motion } from "framer-motion";

const Card = ({
  children,
  className = "",
  hover = false,
  glass = false,
  padding = "md",
  onClick,
  gradient = false,
  border = true,
}) => {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  const baseClasses = `
    rounded-2xl
    ${border ? "border border-slate-100" : ""}
    ${glass ? "glass" : "bg-white"}
    ${gradient ? "gradient-bg text-white" : ""}
    ${paddings[padding]}
    ${hover ? "card-hover cursor-pointer" : ""}
    ${className}
    shadow-soft
  `;

  if (hover || onClick) {
    return (
      <motion.div
        className={baseClasses}
        whileHover={{ y: -2, boxShadow: "0 20px 60px -10px rgba(0,0,0,0.12)" }}
        whileTap={onClick ? { scale: 0.99 } : {}}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={baseClasses}>{children}</div>;
};

export default Card;