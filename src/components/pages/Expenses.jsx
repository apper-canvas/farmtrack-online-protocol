import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ExpenseList from "@/components/organisms/ExpenseList";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { expenseService } from "@/services/api/expenseService";

const Expenses = () => {
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    category: "",
    amount: "",
    description: ""
  });

  useEffect(() => {
    if (location.state?.showAddForm) {
      setShowForm(true);
      // Set default date to today
      setFormData(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'amount' ? parseFloat(value) || '' : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await expenseService.update(editingExpense.Id, formData);
        toast.success("Expense updated successfully");
      } else {
        await expenseService.create(formData);
        toast.success("Expense added successfully");
      }
      handleCloseForm();
      window.location.reload();
    } catch (err) {
      toast.error(editingExpense ? "Failed to update expense" : "Failed to add expense");
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      date: expense.date.split('T')[0],
      category: expense.category,
      amount: expense.amount,
      description: expense.description
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExpense(null);
    setFormData({
      date: "",
      category: "",
      amount: "",
      description: ""
    });
  };

  const handleShowForm = () => {
    setShowForm(true);
    setFormData(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
  };

  return (
    <div>
      <ExpenseList 
        onAdd={handleShowForm} 
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
              className="w-full max-w-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-accent-100 to-primary-100 rounded-xl">
                      <ApperIcon name="Receipt" className="h-6 w-6 text-accent-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {editingExpense ? "Edit Expense" : "Add New Expense"}
                    </h2>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleCloseForm}>
                    <ApperIcon name="X" className="h-5 w-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                    <Select
                      label="Category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="seeds">Seeds</option>
                      <option value="fertilizer">Fertilizer</option>
                      <option value="equipment">Equipment</option>
                      <option value="fuel">Fuel</option>
                      <option value="labor">Labor</option>
                      <option value="utilities">Utilities</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="other">Other</option>
                    </Select>
                  </div>

                  <Input
                    label="Amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    icon="DollarSign"
                    required
                  />

                  <Input
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the expense"
                    required
                  />

                  <div className="flex items-center gap-3 pt-4">
                    <Button type="submit" variant="primary" icon="Check" className="flex-1">
                      {editingExpense ? "Update Expense" : "Add Expense"}
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

export default Expenses;