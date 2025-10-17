import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Get started by adding your first item", 
  actionLabel = "Add Item",
  onAction,
  icon = "Plus",
  className = "" 
}) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full p-6 mb-6">
        <ApperIcon name={icon} className="h-16 w-16 text-primary-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg hover:from-accent-600 hover:to-accent-700 transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <ApperIcon name="Plus" className="h-5 w-5" />
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default Empty;