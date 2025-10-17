import { useState } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const SearchFilter = ({ 
  searchPlaceholder = "Search...",
  filterOptions = [],
  onSearch,
  onFilter,
  onReset,
  showFilter = true 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleFilter = (value) => {
    setFilterValue(value);
    onFilter?.(value);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilterValue("");
    onSearch?.("");
    onFilter?.("");
    onReset?.();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          icon="Search"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {showFilter && filterOptions.length > 0 && (
        <div className="sm:w-48">
          <Select
            value={filterValue}
            onChange={(e) => handleFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      )}
      {(searchTerm || filterValue) && (
        <Button variant="outline" onClick={handleReset} icon="X" size="sm">
          Clear
        </Button>
      )}
    </div>
  );
};

export default SearchFilter;