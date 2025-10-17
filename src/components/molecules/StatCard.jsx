import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ title, value, subtitle, icon, gradient = "primary", change }) => {
  const gradients = {
    primary: "from-primary-500 to-primary-600",
    secondary: "from-secondary-400 to-secondary-500", 
    accent: "from-accent-500 to-accent-600",
    success: "from-success to-primary-500",
    info: "from-info to-secondary-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[gradient]} opacity-5`}></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradients[gradient]} bg-opacity-10`}>
              <ApperIcon name={icon} className={`h-6 w-6 text-${gradient}-500`} />
            </div>
            {change && (
              <div className={`flex items-center gap-1 text-sm ${change > 0 ? 'text-success' : 'text-error'}`}>
                <ApperIcon name={change > 0 ? "TrendingUp" : "TrendingDown"} className="h-4 w-4" />
                {Math.abs(change)}%
              </div>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-3xl font-bold bg-gradient-to-r ${gradients[gradient]} bg-clip-text text-transparent`}>
              {value}
            </p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;