import { Suspense } from "react";
import ProductDetail from "./ProductDetail";
import Navbar from "@/app/components/navbar/page";
import { Skeleton } from "@/components/ui/skeleton";

// Server-side data fetching function
async function fetchProductById(id) {
  if (!id) return null;

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

  try {
    const response = await fetch(`${apiUrl}/api/products/${id}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Loading UI for Suspense
function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <Skeleton className="w-full aspect-square rounded-md" />
        </div>
        <div className="md:w-1/2 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-1/3" />
        </div>
      </div>
    </div>
  );
}

// This is the Server Component that receives dynamic route params
export default async function ProductDetailPage(props) {
  const { params } = props;
  const resolvedParams = await Promise.resolve(params);
  const productId = resolvedParams?.id;

  // Fetch product data with the awaited ID
  const productData = await fetchProductById(productId);

  return (
    <>
      <div className="border-b">
        <Navbar />
      </div>
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail initialData={productData} id={productId} />
      </Suspense>
    </>
  );
}
