import { cn } from "@/utils/cn";

const Badge = ({ children, variant = "default", className, ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-gradient-to-r from-success to-primary-500 text-white",
    warning: "bg-gradient-to-r from-warning to-yellow-500 text-white",
    error: "bg-gradient-to-r from-error to-red-500 text-white",
    info: "bg-gradient-to-r from-info to-blue-500 text-white",
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white",
    secondary: "bg-gradient-to-r from-secondary-400 to-secondary-500 text-white"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;