const STORAGE_KEY = 'farmtrack_expenses';

// Sample expenses for initial data
const sampleExpenses = [
  {
    Id: '1',
    description: 'Wheat Seeds',
    amount: 450,
    category: 'seeds',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    Id: '2',
    description: 'Organic Fertilizer',
    amount: 320,
    category: 'fertilizer',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    Id: '3',
    description: 'Tractor Maintenance',
    amount: 850,
    category: 'maintenance',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    Id: '4',
    description: 'Irrigation Equipment',
    amount: 1200,
    category: 'equipment',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    Id: '5',
    description: 'Diesel Fuel',
    amount: 280,
    category: 'fuel',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Initialize storage with sample data if empty
const initializeStorage = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleExpenses));
    return sampleExpenses;
  }
  try {
    return JSON.parse(existing);
  } catch (error) {
    console.error('Failed to parse expenses from storage:', error);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleExpenses));
    return sampleExpenses;
  }
};

// Get all expenses
const getAll = async () => {
  try {
    const expenses = initializeStorage();
    return expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw new Error('Failed to fetch expenses');
  }
};

// Get expense by ID
const getById = async (id) => {
  try {
    const expenses = initializeStorage();
    const expense = expenses.find(exp => exp.Id === id);
    if (!expense) {
      throw new Error('Expense not found');
    }
    return expense;
  } catch (error) {
    console.error('Error fetching expense:', error);
    throw error;
  }
};

// Create new expense
const create = async (expenseData) => {
  try {
    const expenses = initializeStorage();
    const newExpense = {
      Id: Date.now().toString(),
      description: expenseData.description || '',
      amount: parseFloat(expenseData.amount) || 0,
      category: expenseData.category || 'other',
      date: expenseData.date || new Date().toISOString()
    };
    
    expenses.push(newExpense);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    return newExpense;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw new Error('Failed to create expense');
  }
};

// Update expense
const update = async (id, expenseData) => {
  try {
    const expenses = initializeStorage();
    const index = expenses.findIndex(exp => exp.Id === id);
    
    if (index === -1) {
      throw new Error('Expense not found');
    }
    
    const updatedExpense = {
      ...expenses[index],
      description: expenseData.description ?? expenses[index].description,
      amount: expenseData.amount !== undefined ? parseFloat(expenseData.amount) : expenses[index].amount,
      category: expenseData.category ?? expenses[index].category,
      date: expenseData.date ?? expenses[index].date
    };
    
    expenses[index] = updatedExpense;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    return updatedExpense;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

// Delete expense
const deleteExpense = async (id) => {
  try {
    const expenses = initializeStorage();
    const filteredExpenses = expenses.filter(exp => exp.Id !== id);
    
    if (filteredExpenses.length === expenses.length) {
      throw new Error('Expense not found');
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredExpenses));
    return { success: true, id };
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

// Get expenses by category
const getByCategory = async (category) => {
  try {
    const expenses = await getAll();
    return expenses.filter(exp => exp.category === category);
  } catch (error) {
    console.error('Error fetching expenses by category:', error);
    throw new Error('Failed to fetch expenses by category');
  }
};

// Get expenses by date range
const getByDateRange = async (startDate, endDate) => {
  try {
    const expenses = await getAll();
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate >= new Date(startDate) && expDate <= new Date(endDate);
    });
  } catch (error) {
    console.error('Error fetching expenses by date range:', error);
    throw new Error('Failed to fetch expenses by date range');
  }
};

export const expenseService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteExpense,
  getByCategory,
  getByDateRange
};