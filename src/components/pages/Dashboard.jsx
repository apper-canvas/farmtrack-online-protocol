import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/molecules/StatCard";
import WeatherWidget from "@/components/organisms/WeatherWidget";
import QuickActionBar from "@/components/molecules/QuickActionBar";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { cropService } from "@/services/api/cropService";
import { taskService } from "@/services/api/taskService";
import { expenseService } from "@/services/api/expenseService";
import { format, parseISO, isToday, startOfMonth, endOfMonth } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    crops: [],
    tasks: [],
    expenses: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const [crops, tasks, expenses] = await Promise.all([
        cropService.getAll(),
        taskService.getAll(),
        expenseService.getAll()
      ]);
      setDashboardData({ crops, tasks, expenses });
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = (type) => {
    switch (type) {
      case "crop":
        navigate("/crops", { state: { showAddForm: true } });
        break;
      case "task":
        navigate("/tasks", { state: { showAddForm: true } });
        break;
      case "expense":
        navigate("/expenses", { state: { showAddForm: true } });
        break;
    }
  };

  if (loading) return <Loading type="stats" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

// Safely destructure with array fallbacks to prevent .filter errors
  const crops = Array.isArray(dashboardData.crops) ? dashboardData.crops : [];
  const tasks = Array.isArray(dashboardData.tasks) ? dashboardData.tasks : [];
  const expenses = Array.isArray(dashboardData.expenses) ? dashboardData.expenses : [];
  
  // Calculate statistics
  const activeCrops = crops.filter(crop => crop.status !== "harvested").length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const todayTasks = tasks.filter(task => !task.completed && isToday(parseISO(task.dueDate))).length;
  
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthlyExpenses = expenses
    .filter(expense => {
      const expenseDate = parseISO(expense.date);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const recentTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const getTaskIcon = (type) => {
    const iconMap = {
      watering: "Droplets",
      fertilizing: "Beaker",
      harvesting: "Scissors",
      planting: "Sprout",
      weeding: "Trash2",
      maintenance: "Wrench"
    };
    return iconMap[type] || "CheckSquare";
  };

const getCropName = (cropId) => {
    const crop = crops.find(c => c.id === parseInt(cropId));
    return crop ? crop.name : "All Crops";
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Farm Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening on your farm.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{format(new Date(), "EEEE")}</p>
            <p className="text-lg font-semibold text-gray-900">{format(new Date(), "MMMM d, yyyy")}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Crops"
          value={activeCrops}
          subtitle="Currently growing"
          icon="Sprout"
          gradient="primary"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          subtitle={`${todayTasks} due today`}
          icon="CheckSquare"
          gradient="secondary"
        />
        <StatCard
          title="Monthly Expenses"
          value={`$${monthlyExpenses.toLocaleString()}`}
          subtitle={format(currentMonth, "MMMM yyyy")}
          icon="DollarSign"
          gradient="accent"
        />
        <StatCard
          title="Total Crops"
          value={crops.length}
          subtitle="All time plantings"
          icon="BarChart3"
          gradient="success"
        />
      </div>

      {/* Weather and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeatherWidget />
        </div>
        <div className="hidden lg:block">
          <Card className="p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="primary"
                icon="Sprout"
                onClick={() => handleQuickAdd("crop")}
                className="w-full justify-start"
              >
                Add New Crop
              </Button>
              <Button
                variant="secondary"
                icon="CheckSquare"
                onClick={() => handleQuickAdd("task")}
                className="w-full justify-start"
              >
                Create Task
              </Button>
              <Button
                variant="accent"
                icon="DollarSign"
                onClick={() => handleQuickAdd("expense")}
                className="w-full justify-start"
              >
                Log Expense
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/tasks")}
              >
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {recentTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No pending tasks</p>
              ) : (
recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-gradient-to-br from-secondary-100 to-accent-100 rounded-lg">
                      <ApperIcon name={getTaskIcon(task.type)} className="h-4 w-4 text-secondary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{task.title}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>{format(parseISO(task.dueDate), "MMM d")}</span>
                        <span>•</span>
                        <span>{getCropName(task.cropId)}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={task.priority === "high" ? "error" : task.priority === "medium" ? "warning" : "info"}
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* Recent Expenses */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/expenses")}
              >
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {recentExpenses.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No expenses recorded</p>
              ) : (
recentExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-accent-100 to-primary-100 rounded-lg">
                        <ApperIcon name="Receipt" className="h-4 w-4 text-accent-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{expense.description}</p>
                        <p className="text-xs text-gray-600">{format(parseISO(expense.date), "MMM d, yyyy")}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${expense.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-600 capitalize">{expense.category}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Mobile Quick Actions */}
      <QuickActionBar
        onAddCrop={() => handleQuickAdd("crop")}
        onAddTask={() => handleQuickAdd("task")}
        onAddExpense={() => handleQuickAdd("expense")}
      />
    </div>
  );
};

export default Dashboard;