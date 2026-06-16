const Badge = ({
  children,
  variant = "default",
  size = "sm",
  dot = false,
  className = "",
}) => {
  const variants = {
    default: "bg-slate-100 text-slate-700",
    primary: "bg-indigo-100 text-indigo-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-sky-100 text-sky-700",
    purple: "bg-violet-100 text-violet-700",
    gradient: "gradient-bg text-white",
    dark: "bg-slate-800 text-white",
  };

  const sizes = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-sm",
  };

  const dotColors = {
    default: "bg-slate-500",
    primary: "bg-indigo-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-sky-500",
    purple: "bg-violet-500",
    gradient: "bg-white",
    dark: "bg-slate-300",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;