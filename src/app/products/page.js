import { Suspense } from "react";
import ClientProducts from "./ClientProducts";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "../components/navbar/page";

// Server-side data fetching function
async function fetchProducts(
  categoryParam,
  searchParam,
  minPriceParam,
  maxPriceParam,
  sortParam,
  pageParam
) {
  const params = new URLSearchParams();

  if (categoryParam) params.append("category", categoryParam);
  if (searchParam) params.append("search", searchParam);
  if (minPriceParam) params.append("price[gte]", minPriceParam);
  if (maxPriceParam) params.append("price[lte]", maxPriceParam);
  if (sortParam) params.append("sort", sortParam);
  if (pageParam) params.append("page", pageParam);

  const queryString = params.toString();
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

  try {
    const response = await fetch(`${apiUrl}/api/products?${queryString}`, {
      cache: "no-store", // Disable cache to get fresh data on each request
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: [], count: 0 };
  }
}

// This is the Server Component that receives route params
export default async function ProductsPage(props) {
  // Since NextJS is specifically requiring us to await searchParams
  const { searchParams } = props;
  const searchParamsResolved = await Promise.resolve(searchParams);

  // Now use the resolved searchParams to extract parameters
  const categoryParam = searchParamsResolved?.category || "";
  const searchParam = searchParamsResolved?.search || "";
  const minPriceParam = searchParamsResolved?.minPrice || "";
  const maxPriceParam = searchParamsResolved?.maxPrice || "";
  const sortParam = searchParamsResolved?.sort || "";
  const pageParam = searchParamsResolved?.page || "1";

  // Fetch initial data on the server with individual parameters
  const initialData = await fetchProducts(
    categoryParam,
    searchParam,
    minPriceParam,
    maxPriceParam,
    sortParam,
    pageParam
  );

  // Create initialFilters object for the client component
  const initialFilters = {
    category: categoryParam,
    search: searchParam,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    sort: sortParam,
    page: pageParam,
  };

  return (
    <div className="bg-gray-20 min-h-screen">
      <div className="border-b">
        <Navbar />
      </div>

      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<ProductsLoading />}>
          <ClientProducts
            initialData={initialData}
            initialFilters={initialFilters}
          />
        </Suspense>
      </div>
    </div>
  );
}

// Loading UI for Suspense
function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="space-y-3">
          <Skeleton className="h-[350px] w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
