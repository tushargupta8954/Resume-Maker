import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
}) => {
  const baseClasses = 'btn inline-flex items-center justify-center gap-2 font-medium';

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </>
      )}
    </motion.button>
  );
};

export default Button;