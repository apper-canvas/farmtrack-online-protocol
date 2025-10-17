import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import CropList from "@/components/organisms/CropList";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cropService } from "@/services/api/cropService";

const Crops = () => {
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    variety: "",
    plantedDate: "",
    expectedHarvest: "",
    fieldLocation: "",
    status: "planted",
    notes: ""
  });

  useEffect(() => {
    if (location.state?.showAddForm) {
      setShowForm(true);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCrop) {
        await cropService.update(editingCrop.Id, formData);
        toast.success("Crop updated successfully");
      } else {
        await cropService.create(formData);
        toast.success("Crop added successfully");
      }
      handleCloseForm();
      // Trigger refresh by changing key
      window.location.reload();
    } catch (err) {
      toast.error(editingCrop ? "Failed to update crop" : "Failed to add crop");
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      variety: crop.variety,
      plantedDate: crop.plantedDate.split('T')[0],
      expectedHarvest: crop.expectedHarvest.split('T')[0],
      fieldLocation: crop.fieldLocation,
      status: crop.status,
      notes: crop.notes || ""
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCrop(null);
    setFormData({
      name: "",
      variety: "",
      plantedDate: "",
      expectedHarvest: "",
      fieldLocation: "",
      status: "planted",
      notes: ""
    });
  };

  return (
    <div>
      <CropList 
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
                    <div className="p-2 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl">
                      <ApperIcon name="Sprout" className="h-6 w-6 text-primary-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {editingCrop ? "Edit Crop" : "Add New Crop"}
                    </h2>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleCloseForm}>
                    <ApperIcon name="X" className="h-5 w-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Crop Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Tomatoes"
                      required
                    />
                    <Input
                      label="Variety"
                      name="variety"
                      value={formData.variety}
                      onChange={handleInputChange}
                      placeholder="e.g., Cherry Tomatoes"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Planted Date"
                      name="plantedDate"
                      type="date"
                      value={formData.plantedDate}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Expected Harvest Date"
                      name="expectedHarvest"
                      type="date"
                      value={formData.expectedHarvest}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Field Location"
                      name="fieldLocation"
                      value={formData.fieldLocation}
                      onChange={handleInputChange}
                      placeholder="e.g., North Field, Section A"
                      required
                    />
                    <Select
                      label="Status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="planted">Planted</option>
                      <option value="growing">Growing</option>
                      <option value="ready">Ready</option>
                      <option value="harvested">Harvested</option>
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
                      placeholder="Additional notes about this crop..."
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <Button type="submit" variant="primary" icon="Check" className="flex-1">
                      {editingCrop ? "Update Crop" : "Add Crop"}
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

export default Crops;