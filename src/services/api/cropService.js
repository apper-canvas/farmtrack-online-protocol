// Mock data storage for crops
let crops = [];
let nextId = 1;

// Initialize with sample data
const initializeMockData = () => {
  if (crops.length === 0) {
    crops = [
      {
        Id: nextId++,
        name: "Wheat",
        variety: "Hard Red Winter",
        plantedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        expectedHarvest: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        fieldLocation: "North Field A",
        status: "growing",
        notes: "Regular irrigation schedule",
        createdAt: new Date().toISOString()
      },
      {
        Id: nextId++,
        name: "Corn",
        variety: "Sweet Corn",
        plantedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        expectedHarvest: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        fieldLocation: "South Field B",
        status: "growing",
        notes: "Monitor for pests",
        createdAt: new Date().toISOString()
      },
      {
        Id: nextId++,
        name: "Soybeans",
        variety: "Roundup Ready",
        plantedDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        expectedHarvest: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        fieldLocation: "East Field C",
        status: "harvested",
        notes: "Successful harvest",
        createdAt: new Date().toISOString()
      }
    ];
  }
};

// Create new crop
const create = async (cropData) => {
  try {
    if (!cropData || typeof cropData !== 'object') {
      throw new Error('Invalid crop data provided');
    }

    const requiredFields = ['name', 'variety', 'plantedDate', 'expectedHarvest', 'fieldLocation', 'status'];
    const missingFields = requiredFields.filter(field => !cropData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const newCrop = {
      Id: nextId++,
      name: cropData.name?.trim() || '',
      variety: cropData.variety?.trim() || '',
      plantedDate: cropData.plantedDate,
      expectedHarvest: cropData.expectedHarvest,
      fieldLocation: cropData.fieldLocation?.trim() || '',
      status: cropData.status || 'planted',
      notes: cropData.notes?.trim() || '',
      createdAt: new Date().toISOString()
    };

    crops.push(newCrop);
    return { success: true, data: newCrop };
  } catch (error) {
    console.error('Error creating crop:', error);
    throw error;
  }
};

// Update existing crop
const update = async (id, cropData) => {
  try {
    if (!id) {
      throw new Error('Crop ID is required for update');
    }

    if (!cropData || typeof cropData !== 'object') {
      throw new Error('Invalid crop data provided');
    }

    const index = crops.findIndex(c => c.Id === id);
    
    if (index === -1) {
      throw new Error(`Crop with ID ${id} not found`);
    }

    const updatedCrop = {
      ...crops[index],
      name: cropData.name?.trim() || crops[index].name,
      variety: cropData.variety?.trim() || crops[index].variety,
      plantedDate: cropData.plantedDate || crops[index].plantedDate,
      expectedHarvest: cropData.expectedHarvest || crops[index].expectedHarvest,
      fieldLocation: cropData.fieldLocation?.trim() || crops[index].fieldLocation,
      status: cropData.status || crops[index].status,
      notes: cropData.notes?.trim() || crops[index].notes,
      updatedAt: new Date().toISOString()
    };

    crops[index] = updatedCrop;
    return { success: true, data: updatedCrop };
  } catch (error) {
    console.error('Error updating crop:', error);
    throw error;
  }
};

// Delete crop
const deleteCrop = async (id) => {
  try {
    if (!id) {
      throw new Error('Crop ID is required for deletion');
    }

    const index = crops.findIndex(c => c.Id === id);
    
    if (index === -1) {
      throw new Error(`Crop with ID ${id} not found`);
    }

    const deletedCrop = crops[index];
    crops.splice(index, 1);
    
    return { success: true, data: deletedCrop };
  } catch (error) {
    console.error('Error deleting crop:', error);
    throw error;
  }
};

// Get all crops
const getAll = async () => {
  try {
    initializeMockData();
    return { success: true, data: [...crops] };
  } catch (error) {
    console.error('Error fetching crops:', error);
    throw error;
  }
};

// Validation helpers
const validateCropData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Crop name is required');
  }

  if (!data.variety || data.variety.trim().length === 0) {
    errors.push('Variety is required');
  }

  if (!data.plantedDate) {
    errors.push('Planted date is required');
  }

  if (!data.expectedHarvest) {
    errors.push('Expected harvest date is required');
  }

  if (data.plantedDate && data.expectedHarvest && new Date(data.plantedDate) > new Date(data.expectedHarvest)) {
    errors.push('Expected harvest date must be after planted date');
  }

  if (!data.fieldLocation || data.fieldLocation.trim().length === 0) {
    errors.push('Field location is required');
  }

  return errors;
};

// Initialize mock data on module load
initializeMockData();

export const cropService = {
  create,
  update,
  delete: deleteCrop,
  getAll,
  validateCropData
};