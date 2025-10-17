// Mock task service with localStorage persistence
let tasks = [];

// Initialize with mock data
function initializeMockData() {
  const stored = localStorage.getItem('farmtrack_tasks');
  if (stored) {
    tasks = JSON.parse(stored);
  } else {
    tasks = [
      {
        Id: 1,
        title: "Water tomato plants",
        description: "Check soil moisture and water if needed",
        cropId: 1,
        type: "watering",
        priority: "high",
        dueDate: new Date().toISOString(),
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
      },
      {
        Id: 2,
        title: "Fertilize crops",
        description: "Apply organic fertilizer",
        cropId: 2,
        type: "fertilizing",
        priority: "medium",
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
      },
      {
        Id: 3,
        title: "Harvest lettuce",
        description: "Ready for harvest",
        cropId: 3,
        type: "harvesting",
        priority: "high",
        dueDate: new Date(Date.now() + 172800000).toISOString(),
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
      }
    ];
    saveTasks();
  }
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('farmtrack_tasks', JSON.stringify(tasks));
}

// Validate task data
function validateTaskData(data) {
  const errors = [];
  
  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (!data.cropId) {
    errors.push('Crop is required');
  }
  
  if (!data.dueDate) {
    errors.push('Due date is required');
  }
  
  if (!data.priority || !['low', 'medium', 'high'].includes(data.priority)) {
    errors.push('Valid priority is required (low, medium, high)');
  }
  
  if (!data.type || !['watering', 'fertilizing', 'harvesting', 'planting', 'weeding', 'maintenance'].includes(data.type)) {
    errors.push('Valid task type is required');
  }
  
  return errors;
}

// Get all tasks
async function getAll() {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, data: [...tasks] };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return { success: false, error: 'Failed to fetch tasks' };
  }
}

// Create new task
async function create(taskData) {
  try {
    const errors = validateTaskData(taskData);
    if (errors.length > 0) {
      return { success: false, error: errors.join(', ') };
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newTask = {
      ...taskData,
      Id: Date.now(),
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    
    tasks.push(newTask);
    saveTasks();
    
    return { success: true, data: newTask };
  } catch (error) {
    console.error('Error creating task:', error);
    return { success: false, error: 'Failed to create task' };
  }
}

// Update existing task
async function update(id, taskData) {
  try {
    const errors = validateTaskData(taskData);
    if (errors.length > 0) {
      return { success: false, error: errors.join(', ') };
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      return { success: false, error: 'Task not found' };
    }
    
    tasks[index] = {
      ...tasks[index],
      ...taskData,
      Id: parseInt(id)
    };
    
    saveTasks();
    
    return { success: true, data: tasks[index] };
  } catch (error) {
    console.error('Error updating task:', error);
    return { success: false, error: 'Failed to update task' };
  }
}

// Delete task
async function deleteTask(id) {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      return { success: false, error: 'Task not found' };
    }
    
    tasks.splice(index, 1);
    saveTasks();
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false, error: 'Failed to delete task' };
  }
}

// Toggle task completion
async function toggleComplete(id) {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      return { success: false, error: 'Task not found' };
    }
    
    tasks[index].completed = !tasks[index].completed;
    tasks[index].completedAt = tasks[index].completed ? new Date().toISOString() : null;
    
    saveTasks();
    
    return { success: true, data: tasks[index] };
  } catch (error) {
    console.error('Error toggling task completion:', error);
    return { success: false, error: 'Failed to update task status' };
  }
}

// Get pending tasks
function getPending() {
  return tasks.filter(t => !t.completed);
}

// Get completed tasks
function getCompleted() {
  return tasks.filter(t => t.completed);
}

// Get tasks due today
function getDueToday() {
  const today = new Date().toDateString();
  return tasks.filter(t => {
    const dueDate = new Date(t.dueDate).toDateString();
    return dueDate === today && !t.completed;
  });
}

// Get overdue tasks
function getOverdue() {
  const now = new Date();
  return tasks.filter(t => {
    const dueDate = new Date(t.dueDate);
    return dueDate < now && !t.completed;
  });
}

// Initialize on load
initializeMockData();

export const taskService = {
  getAll,
  create,
  update,
  delete: deleteTask,
  toggleComplete,
  getPending,
  getCompleted,
  getDueToday,
  getOverdue
};