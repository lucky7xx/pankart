"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/app/components/products/ProductCard";

export default function ClientProducts({ initialData, initialFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Initialize filters from props or URL search params
  const [filters, setFilters] = useState({
    category: initialFilters.category || "",
    search: initialFilters.search || "",
    minPrice: initialFilters.minPrice || "",
    maxPrice: initialFilters.maxPrice || "",
    sort: initialFilters.sort || "",
    page: parseInt(initialFilters.page || "1", 10),
  });

  // Separate input states for controlled inputs
  const [searchInput, setSearchInput] = useState(filters.search);
  const [minPriceInput, setMinPriceInput] = useState(filters.minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice);

  // Update local state when URL changes
  useEffect(() => {
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const sort = searchParams.get("sort") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);

    const newFilters = {
      category,
      search,
      minPrice,
      maxPrice,
      sort,
      page,
    };

    // Only update if filters have changed
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      setFilters(newFilters);
      setSearchInput(search);
      setMinPriceInput(minPrice);
      setMaxPriceInput(maxPrice);

      // Invalidate and refetch when URL params change
      queryClient.invalidateQueries(["products"]);
    }
  }, [searchParams, queryClient]);

  const categories = ["electronics", "clothing", "books", "home", "other"];

  // Fetch products for client-side updates
  const fetchProducts = async () => {
    const params = new URLSearchParams();

    if (filters.category) params.append("category", filters.category);
    if (filters.search) params.append("search", filters.search);
    if (filters.minPrice) params.append("price[gte]", filters.minPrice);
    if (filters.maxPrice) params.append("price[lte]", filters.maxPrice);
    if (filters.sort) params.append("sort", filters.sort);
    if (filters.page) params.append("page", filters.page);

    const queryString = params.toString();
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

    console.log("Fetching products with query:", queryString);

    const response = await fetch(`${apiUrl}/api/products?${queryString}`, {
      // Add cache: 'no-store' to avoid browser caching
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  };

  // Use React Query with initialData from server
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", filters],
    queryFn: fetchProducts,
    initialData: initialData,
    staleTime: 0, // Set to 0 to always refetch when needed
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  // Handle form submission for search/price filters
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    // Apply input values to filters and reset page
    const newFilters = {
      ...filters,
      search: searchInput,
      minPrice: minPriceInput,
      maxPrice: maxPriceInput,
      page: 1,
    };

    // Build URL and navigate
    const queryString = buildQueryString(newFilters);
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  };

  // Handle dropdown changes (category & sort)
  const handleCategoryChange = (value) => {
    // For dropdown selects
    const newFilters = {
      ...filters,
      category: value === "all" ? "" : value,
      page: 1, // Reset to page 1
    };

    // Build URL and navigate
    const queryString = buildQueryString(newFilters);
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  };

  const handleSortChange = (value) => {
    // For dropdown selects
    const newFilters = {
      ...filters,
      sort: value === "default" ? "" : value,
      page: 1, // Reset to page 1
    };

    // Build URL and navigate
    const queryString = buildQueryString(newFilters);
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    // For pagination
    const newFilters = {
      ...filters,
      page: newPage,
    };

    // Build URL and navigate
    const queryString = buildQueryString(newFilters);
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  };

  // Generate URL query string based on filters
  const buildQueryString = (filters) => {
    const params = new URLSearchParams();

    if (filters.category) params.append("category", filters.category);
    if (filters.search) params.append("search", filters.search);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    if (filters.sort) params.append("sort", filters.sort);
    if (filters.page > 1) params.append("page", filters.page);

    return params.toString();
  };

  return (
    <>
      {/* Search and Filters Form */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="relative flex-grow mb-4 md:mb-0">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <Select
            value={filters.category ? filters.category : "all"}
            onValueChange={handleCategoryChange}
            className="w-full md:w-auto"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.sort ? filters.sort : "default"}
            onValueChange={handleSortChange}
            className="w-full md:w-auto"
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="-createdAt">Newest</SelectItem>
              <SelectItem value="price">Price: Low to High</SelectItem>
              <SelectItem value="-price">Price: High to Low</SelectItem>
              <SelectItem value="name">Name: A to Z</SelectItem>
              <SelectItem value="-name">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Label>Min Price</Label>
            <Input
              type="number"
              placeholder="Min"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              className="w-24"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label>Max Price</Label>
            <Input
              type="number"
              placeholder="Max"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className="w-24"
            />
          </div>

          <Button type="submit">Apply Filters</Button>
        </div>
      </form>

      {/* Products Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-600">
          {data?.count || 0} styles | View {data?.data?.length || 0} per page
        </div>
      </div>

      {/* Product Grid */}
      <div>
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="space-y-3">
                <Skeleton className="h-[350px] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12 bg-red-50 rounded-lg">
            <p className="text-red-600 text-lg">
              Error loading products: {error.message}
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && !isError && (
          <>
            {data?.data?.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-xl text-gray-600">
                  No products found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {data?.data?.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {data?.pagination && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={!data.pagination.prev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Button variant="outline" disabled>
                    Page {filters.page}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={!data.pagination.next}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
