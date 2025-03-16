"use client";

import { useState, useEffect } from "react";

export default function ProductFilter({
  categories,
  initialFilters,
  onFilterChange,
}) {
  const [filters, setFilters] = useState({
    category: initialFilters.category || "",
    minPrice: initialFilters.minPrice || "",
    maxPrice: initialFilters.maxPrice || "",
    search: initialFilters.search || "",
  });

  useEffect(() => {
    setFilters({
      category: initialFilters.category || "",
      minPrice: initialFilters.minPrice || "",
      maxPrice: initialFilters.maxPrice || "",
      search: initialFilters.search || "",
    });
  }, [initialFilters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      category: "",
      minPrice: "",
      maxPrice: "",
      search: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="search"
            className="block text-gray-700 font-medium mb-2"
          >
            Search
          </label>
          <input
            type="text"
            id="search"
            name="search"
            value={filters.search}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search products..."
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-700 font-medium mb-2"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Price Range
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleInputChange}
              className="w-1/2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Min"
              min="0"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleInputChange}
              className="w-1/2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Max"
              min="0"
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
