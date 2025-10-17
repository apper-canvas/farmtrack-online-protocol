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
import { cropService } from "@/services/api/cropService";
import { format, differenceInDays, parseISO } from "date-fns";

const CropList = ({ onAdd, onEdit }) => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredCrops, setFilteredCrops] = useState([]);

  useEffect(() => {
    loadCrops();
  }, []);

  useEffect(() => {
    setFilteredCrops(crops);
  }, [crops]);

  const loadCrops = async () => {
    try {
      setLoading(true);
      setError("");
const response = await cropService.getAll();
      setCrops(response?.data || []);
    } catch (err) {
      setError("Failed to load crops");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredCrops(crops);
      return;
    }
    const filtered = crops.filter(crop => 
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.fieldLocation.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCrops(filtered);
  };

  const handleFilter = (status) => {
    if (!status) {
      setFilteredCrops(crops);
      return;
    }
    const filtered = crops.filter(crop => crop.status === status);
    setFilteredCrops(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;
    
    try {
      await cropService.delete(id);
      setCrops(crops.filter(crop => crop.Id !== id));
      toast.success("Crop deleted successfully");
    } catch (err) {
      toast.error("Failed to delete crop");
    }
  };

  const getStatusVariant = (status) => {
    const variants = {
      planted: "info",
      growing: "warning",
      ready: "success",
      harvested: "secondary"
    };
    return variants[status] || "default";
  };

  const getDaysToHarvest = (expectedHarvest) => {
    const days = differenceInDays(parseISO(expectedHarvest), new Date());
    return days;
  };

  const filterOptions = [
    { value: "planted", label: "Planted" },
    { value: "growing", label: "Growing" },
    { value: "ready", label: "Ready" },
    { value: "harvested", label: "Harvested" }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCrops} />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Crops</h2>
          <p className="text-gray-600">Manage your crop plantings and harvest schedules</p>
        </div>
        <Button onClick={onAdd} icon="Plus" variant="accent" size="lg">
          Add Crop
        </Button>
      </div>

      <SearchFilter
        searchPlaceholder="Search crops by name, variety, or location..."
        filterOptions={filterOptions}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />

      {filteredCrops.length === 0 ? (
        <Empty
          title="No crops found"
          description="Start tracking your crops by adding your first planting"
          actionLabel="Add Your First Crop"
          onAction={onAdd}
          icon="Sprout"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop, index) => (
            <motion.div
              key={crop.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="p-6 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl">
                      <ApperIcon name="Sprout" className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{crop.name}</h3>
                      <p className="text-sm text-gray-600">{crop.variety}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(crop.status)}>
                    {crop.status}
                  </Badge>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="MapPin" className="h-4 w-4" />
                    {crop.fieldLocation}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="Calendar" className="h-4 w-4" />
                    Planted: {format(parseISO(crop.plantedDate), "MMM d, yyyy")}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="Clock" className="h-4 w-4" />
                    {crop.status !== "harvested" ? (
                      <>
                        {getDaysToHarvest(crop.expectedHarvest) > 0 
                          ? `${getDaysToHarvest(crop.expectedHarvest)} days to harvest`
                          : "Ready for harvest!"
                        }
                      </>
                    ) : (
                      "Harvested"
                    )}
                  </div>
                  {crop.notes && (
                    <div className="text-sm text-gray-600 italic">
                      "{crop.notes}"
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon="Edit"
                    onClick={() => onEdit(crop)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={() => handleDelete(crop.Id)}
                    className="text-error hover:text-error hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropList;