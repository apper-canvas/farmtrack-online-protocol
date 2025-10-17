import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, className = "" }) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-error/10 rounded-full p-4 mb-4">
        <ApperIcon name="AlertTriangle" className="h-12 w-12 text-error" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops!</h3>
      <p className="text-gray-600 mb-4 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-200 hover:scale-105"
        >
          <ApperIcon name="RotateCcw" className="h-4 w-4" />
          Try Again
        </button>
      )}
    </motion.div>
  );
};

export default Error;