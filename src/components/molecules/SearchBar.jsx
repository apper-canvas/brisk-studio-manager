import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch,
  className = "",
  showFilter = false,
  filterOptions = [],
  onFilterChange,
  selectedFilter = ""
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  return (
    <div className={cn("flex items-center space-x-4", className)}>
      {/* Search Input */}
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" 
        />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-surface border-slate-600 focus:border-primary"
        />
      </div>

      {/* Filter Dropdown */}
      {showFilter && filterOptions.length > 0 && (
        <div className="relative">
          <select
            value={selectedFilter}
            onChange={(e) => onFilterChange?.(e.target.value)}
            className="appearance-none bg-surface border border-slate-600 rounded-lg px-4 py-2 pr-10 text-sm text-slate-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All</option>
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ApperIcon 
            name="ChevronDown" 
            size={16} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" 
          />
        </div>
      )}
    </div>
  );
};

export default SearchBar;