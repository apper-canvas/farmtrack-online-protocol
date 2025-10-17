import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  className, 
  children,
  label,
  error,
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors appearance-none pr-10",
            error && "border-error focus:border-error focus:ring-error",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;