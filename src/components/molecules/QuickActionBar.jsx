import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";

const QuickActionBar = ({ onAddCrop, onAddTask, onAddExpense }) => {
  const actions = [
    { label: "Add Crop", icon: "Sprout", onClick: onAddCrop, variant: "primary" },
    { label: "Add Task", icon: "CheckSquare", onClick: onAddTask, variant: "secondary" },
    { label: "Add Expense", icon: "DollarSign", onClick: onAddExpense, variant: "accent" }
  ];

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 lg:hidden"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
        <div className="flex items-center gap-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant={action.variant}
                size="sm"
                icon={action.icon}
                onClick={action.onClick}
                className="shadow-lg"
              >
                {action.label}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default QuickActionBar;