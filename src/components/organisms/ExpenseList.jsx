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
import { expenseService } from "@/services/api/expenseService";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

const ExpenseList = ({ onAdd, onEdit }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    filterExpensesByMonth();
  }, [expenses, selectedMonth]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await expenseService.getAll();
      setExpenses(data);
    } catch (err) {
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const filterExpensesByMonth = () => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    
    const filtered = expenses.filter(expense => 
      isWithinInterval(parseISO(expense.date), { start: monthStart, end: monthEnd })
    );
    
    setFilteredExpenses(filtered.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      filterExpensesByMonth();
      return;
    }
    const filtered = filteredExpenses.filter(expense => 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExpenses(filtered);
  };

  const handleFilter = (category) => {
    if (!category) {
      filterExpensesByMonth();
      return;
    }
    const filtered = expenses.filter(expense => {
      const monthStart = startOfMonth(selectedMonth);
      const monthEnd = endOfMonth(selectedMonth);
      return expense.category === category && 
             isWithinInterval(parseISO(expense.date), { start: monthStart, end: monthEnd });
    });
    setFilteredExpenses(filtered.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    
    try {
      await expenseService.delete(id);
      setExpenses(expenses.filter(expense => expense.Id !== id));
      toast.success("Expense deleted successfully");
    } catch (err) {
      toast.error("Failed to delete expense");
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      seeds: "Sprout",
      fertilizer: "Beaker", 
      equipment: "Wrench",
      fuel: "Fuel",
      labor: "Users",
      utilities: "Zap",
      maintenance: "Settings",
      other: "Receipt"
    };
    return iconMap[category] || "Receipt";
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      seeds: "primary",
      fertilizer: "secondary",
      equipment: "accent",
      fuel: "warning",
      labor: "info",
      utilities: "error",
      maintenance: "success",
      other: "default"
    };
    return colorMap[category] || "default";
  };

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const filterOptions = [
    { value: "seeds", label: "Seeds" },
    { value: "fertilizer", label: "Fertilizer" },
    { value: "equipment", label: "Equipment" },
    { value: "fuel", label: "Fuel" },
    { value: "labor", label: "Labor" },
    { value: "utilities", label: "Utilities" },
    { value: "maintenance", label: "Maintenance" },
    { value: "other", label: "Other" }
  ];

  const changeMonth = (direction) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(selectedMonth.getMonth() + direction);
    setSelectedMonth(newMonth);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadExpenses} />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
          <p className="text-gray-600">Track and manage your farm expenses</p>
        </div>
        <Button onClick={onAdd} icon="Plus" variant="accent" size="lg">
          Add Expense
        </Button>
      </div>

      {/* Month Navigation and Total */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            icon="ChevronLeft"
            onClick={() => changeMonth(-1)}
          />
          <h3 className="text-lg font-semibold text-gray-900">
            {format(selectedMonth, "MMMM yyyy")}
          </h3>
          <Button
            variant="outline"
            size="sm"
            icon="ChevronRight"
            onClick={() => changeMonth(1)}
          />
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600">Total for {format(selectedMonth, "MMMM")}</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-transparent">
            ${totalExpenses.toLocaleString()}
          </p>
        </div>
      </div>

      <SearchFilter
        searchPlaceholder="Search expenses by description or category..."
        filterOptions={filterOptions}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />

      {filteredExpenses.length === 0 ? (
        <Empty
          title="No expenses found"
          description={`No expenses recorded for ${format(selectedMonth, "MMMM yyyy")}`}
          actionLabel="Add Your First Expense"
          onAction={onAdd}
          icon="Receipt"
        />
      ) : (
        <div className="space-y-4">
          {filteredExpenses.map((expense, index) => (
            <motion.div
              key={expense.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-${getCategoryColor(expense.category)}-100 to-${getCategoryColor(expense.category)}-200`}>
                      <ApperIcon name={getCategoryIcon(expense.category)} className={`h-6 w-6 text-${getCategoryColor(expense.category)}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{expense.description}</h3>
                        <Badge variant={getCategoryColor(expense.category)}>
                          {expense.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Calendar" className="h-4 w-4" />
                          {format(parseISO(expense.date), "MMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ${expense.amount.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon="Edit"
                        onClick={() => onEdit(expense)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={() => handleDelete(expense.Id)}
                        className="text-error hover:text-error hover:bg-red-50"
                      />
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

export default ExpenseList;