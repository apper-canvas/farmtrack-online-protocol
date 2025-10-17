import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import SearchFilter from "@/components/molecules/SearchFilter";
import { taskService } from "@/services/api/taskService";
import { cropService } from "@/services/api/cropService";
import { format, parseISO, isToday, isPast, isFuture } from "date-fns";

const TaskList = ({ onAdd, onEdit }) => {
  const [tasks, setTasks] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTasksByTab(activeTab);
  }, [tasks, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [taskData, cropData] = await Promise.all([
taskService.getAll(),
        cropService.getAll()
      ]);
      setTasks(taskData?.data || []);
      setCrops(cropData);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const filterTasksByTab = (tab) => {
    let filtered = [...tasks];
    
    switch (tab) {
      case "today":
        filtered = filtered.filter(task => !task.completed && isToday(parseISO(task.dueDate)));
        break;
      case "upcoming":
        filtered = filtered.filter(task => !task.completed && isFuture(parseISO(task.dueDate)));
        break;
      case "overdue":
        filtered = filtered.filter(task => !task.completed && isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate)));
        break;
      case "completed":
        filtered = filtered.filter(task => task.completed);
        break;
      default:
        break;
    }
    
    setFilteredTasks(filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
  };

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = {
        ...task,
        completed: !task.completed,
        completedDate: !task.completed ? new Date().toISOString() : null
      };
      
      await taskService.update(task.Id, updatedTask);
      setTasks(tasks.map(t => t.Id === task.Id ? updatedTask : t));
      toast.success(updatedTask.completed ? "Task completed!" : "Task reopened");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await taskService.delete(id);
      setTasks(tasks.filter(task => task.Id !== id));
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const getCropName = (cropId) => {
    const crop = crops.find(c => c.Id === parseInt(cropId));
    return crop ? crop.name : "All Crops";
  };

  const getPriorityVariant = (priority) => {
    const variants = {
      high: "error",
      medium: "warning", 
      low: "info"
    };
    return variants[priority] || "default";
  };

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

const tabs = [
    { key: "all", label: "All Tasks", count: tasks.length },
    { key: "today", label: "Today", count: tasks.filter(t => !t.completed && t.dueDate && isToday(parseISO(t.dueDate))).length },
    { key: "upcoming", label: "Upcoming", count: tasks.filter(t => !t.completed && t.dueDate && isFuture(parseISO(t.dueDate))).length },
    { key: "overdue", label: "Overdue", count: tasks.filter(t => !t.completed && t.dueDate && isPast(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate))).length },
    { key: "completed", label: "Completed", count: tasks.filter(t => t.completed).length }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <p className="text-gray-600">Manage your farm tasks and stay on schedule</p>
        </div>
        <Button onClick={onAdd} icon="Plus" variant="accent" size="lg">
          Add Task
        </Button>
      </div>

      {/* Task Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.key 
                  ? "bg-white/20 text-white" 
                  : "bg-gray-100 text-gray-600"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <Empty
          title="No tasks found"
          description={
            activeTab === "all" 
              ? "Start organizing your farm work by adding your first task"
              : `No ${activeTab} tasks at the moment`
          }
          actionLabel="Add Your First Task"
          onAction={onAdd}
          icon="CheckSquare"
        />
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`p-6 ${task.completed ? 'opacity-75' : ''}`}>
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleComplete(task)}
                    className={`mt-1 p-2 rounded-lg transition-all duration-200 ${
                      task.completed 
                        ? "bg-success text-white" 
                        : "bg-gray-100 text-gray-400 hover:bg-primary-50 hover:text-primary-600"
                    }`}
                  >
                    <ApperIcon name="Check" className="h-4 w-4" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-secondary-100 to-accent-100 rounded-lg">
                          <ApperIcon name={getTaskIcon(task.type)} className="h-5 w-5 text-secondary-600" />
                        </div>
                        <div>
                          <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-600 capitalize">{task.type}</p>
                        </div>
                      </div>
                      <Badge variant={getPriorityVariant(task.priority)}>
                        {task.priority} priority
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Calendar" className="h-4 w-4" />
                        Due: {format(parseISO(task.dueDate), "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Sprout" className="h-4 w-4" />
                        {getCropName(task.cropId)}
                      </div>
                      {task.completed && task.completedDate && (
                        <div className="flex items-center gap-1 text-success">
                          <ApperIcon name="CheckCircle" className="h-4 w-4" />
                          Completed: {format(parseISO(task.completedDate), "MMM d, yyyy")}
                        </div>
                      )}
                    </div>

                    {task.notes && (
                      <div className="text-sm text-gray-600 italic mb-4">
                        "{task.notes}"
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon="Edit"
                        onClick={() => onEdit(task)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={() => handleDelete(task.Id)}
                        className="text-error hover:text-error hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;