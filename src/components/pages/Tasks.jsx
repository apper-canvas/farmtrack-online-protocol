import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import TaskList from "@/components/organisms/TaskList";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { cropService } from "@/services/api/cropService";

const Tasks = () => {
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [crops, setCrops] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    dueDate: "",
    cropId: "",
    priority: "medium",
    notes: ""
  });

  useEffect(() => {
    loadCrops();
    if (location.state?.showAddForm) {
      setShowForm(true);
    }
  }, [location.state]);

  const loadCrops = async () => {
    try {
      const data = await cropService.getAll();
      setCrops(data);
    } catch (err) {
      toast.error("Failed to load crops");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...formData,
        completed: false,
        completedDate: null
      };

      if (editingTask) {
        await taskService.update(editingTask.Id, taskData);
        toast.success("Task updated successfully");
      } else {
        await taskService.create(taskData);
        toast.success("Task added successfully");
      }
      handleCloseForm();
      window.location.reload();
    } catch (err) {
      toast.error(editingTask ? "Failed to update task" : "Failed to add task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      type: task.type,
      dueDate: task.dueDate.split('T')[0],
      cropId: task.cropId,
      priority: task.priority,
      notes: task.notes || ""
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormData({
      title: "",
      type: "",
      dueDate: "",
      cropId: "",
      priority: "medium",
      notes: ""
    });
  };

  return (
    <div>
      <TaskList 
        onAdd={() => setShowForm(true)} 
        onEdit={handleEdit}
      />

      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-secondary-100 to-accent-100 rounded-xl">
                      <ApperIcon name="CheckSquare" className="h-6 w-6 text-secondary-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {editingTask ? "Edit Task" : "Add New Task"}
                    </h2>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleCloseForm}>
                    <ApperIcon name="X" className="h-5 w-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Task Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Water tomatoes in greenhouse"
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Task Type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select task type</option>
                      <option value="watering">Watering</option>
                      <option value="fertilizing">Fertilizing</option>
                      <option value="harvesting">Harvesting</option>
                      <option value="planting">Planting</option>
                      <option value="weeding">Weeding</option>
                      <option value="maintenance">Maintenance</option>
                    </Select>

                    <Select
                      label="Priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Due Date"
                      name="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      required
                    />
                    
                    <Select
                      label="Related Crop"
                      name="cropId"
                      value={formData.cropId}
                      onChange={handleInputChange}
                    >
                      <option value="">All Crops</option>
                      {crops.map((crop) => (
                        <option key={crop.Id} value={crop.Id}>
                          {crop.name} ({crop.variety})
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                      rows={3}
                      placeholder="Additional notes about this task..."
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <Button type="submit" variant="primary" icon="Check" className="flex-1">
                      {editingTask ? "Update Task" : "Add Task"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCloseForm} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;