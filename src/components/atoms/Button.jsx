import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md", 
  icon,
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus:ring-primary-500 shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-secondary-400 to-secondary-500 text-white hover:from-secondary-500 hover:to-secondary-600 focus:ring-secondary-400 shadow-lg hover:shadow-xl",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 focus:ring-accent-500 shadow-lg hover:shadow-xl",
    outline: "border-2 border-primary-500 text-primary-700 hover:bg-primary-50 focus:ring-primary-500",
    ghost: "text-primary-700 hover:bg-primary-50 focus:ring-primary-500",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm gap-1",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
    xl: "px-8 py-4 text-lg gap-3"
  };

  return (
    <motion.button
      ref={ref}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {loading && <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />}
      {!loading && icon && <ApperIcon name={icon} className="h-4 w-4" />}
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;