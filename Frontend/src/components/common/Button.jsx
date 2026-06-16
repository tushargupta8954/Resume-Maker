import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  fullWidth = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  const baseClasses =
    "btn-base focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  const variants = {
    primary:
      "gradient-bg text-white hover:opacity-90 focus-visible:ring-indigo-500 shadow-md shadow-indigo-200/50 hover:shadow-lg hover:shadow-indigo-200/60",
    secondary:
      "bg-white text-slate-700 border-2 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 focus-visible:ring-indigo-400",
    outline:
      "bg-transparent text-indigo-600 border-2 border-indigo-300 hover:bg-indigo-50 focus-visible:ring-indigo-400",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-800 focus-visible:ring-slate-400",
    danger:
      "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-400 shadow-md shadow-red-200/50",
    success:
      "bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-400 shadow-md",
    warning:
      "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-400",
    dark: "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-500 shadow-md",
    ai: "bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 text-white hover:opacity-90 shadow-md shadow-purple-200/50 hover:shadow-purple-200/70",
  };

  const sizes = {
    xs: "px-2.5 py-1.5 text-xs rounded-md gap-1",
    sm: "px-3.5 py-2 text-sm rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-6 py-3 text-base rounded-xl gap-2",
    xl: "px-8 py-4 text-lg rounded-2xl gap-2.5",
  };

  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.01 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
        ${className}
        transition-all duration-200
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && (
            <Icon className={size === "xs" ? "w-3 h-3" : size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
          )}
          {children}
          {Icon && iconPosition === "right" && (
            <Icon className={size === "xs" ? "w-3 h-3" : size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
          )}
        </>
      )}
    </motion.button>
  );
};

export default Button;