import { motion } from "framer-motion";

const Loading = ({ className = "", rows = 3, type = "card" }) => {
  if (type === "stats") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="bg-surface rounded-xl p-6 shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-primary-200 rounded w-20"></div>
              <div className="h-8 bg-primary-300 rounded w-16"></div>
              <div className="h-3 bg-primary-200 rounded w-24"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "weather") {
    return (
      <div className="bg-gradient-to-br from-info to-secondary-400 rounded-xl p-6 text-white">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded w-32"></div>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 bg-white/30 rounded w-20"></div>
              <div className="h-4 bg-white/20 rounded w-24"></div>
            </div>
            <div className="h-16 w-16 bg-white/20 rounded-full"></div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="text-center space-y-1">
                <div className="h-3 bg-white/20 rounded w-8 mx-auto"></div>
                <div className="h-8 w-8 bg-white/20 rounded mx-auto"></div>
                <div className="h-3 bg-white/20 rounded w-6 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: rows }, (_, i) => (
        <motion.div
          key={i}
          className="bg-surface rounded-xl p-6 shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="animate-pulse space-y-3">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-primary-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-primary-300 rounded w-3/4"></div>
                <div className="h-3 bg-primary-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 w-20 bg-secondary-200 rounded-full"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Loading;