"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, ShoppingCart, ChevronLeft } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";

export default function ProductDetail({ initialData, id }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Use initialData from server, fetches updates client-side if needed
  const {
    data: productData,
    isLoading: productLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch product");
      }

      return res.json();
    },
    initialData: initialData, // Use server-fetched data initially
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  const product = productData?.data;

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleGoBack = () => {
    router.push("/products");
  };

  const handleAddToCart = () => {
    // Check if user is logged in
    if (!user) {
      alert("Please log in to add items to cart");
      router.push("/login");
      return;
    }

    // Validate product and quantity
    if (!product) {
      alert("Product information is unavailable");
      return;
    }

    setIsLoading(true);

    try {
      // Dispatch add to cart action
      dispatch(
        addToCart({
          product,
          quantity,
          userId: user._id,
        })
      );

      // Show success feedback
      alert(`${product.name} (Qty: ${quantity}) added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart");
    } finally {
      setIsLoading(false);
    }
  };

  // If still loading with no initialData
  if (productLoading && !initialData) {
    return <div>Loading product details...</div>;
  }

  if (error && !initialData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-900 px-4 py-3 rounded">
          <p>Error loading product: {error.message}</p>
        </div>
        <div className="mt-4">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-900 px-4 py-3 rounded">
          <p>Product not found</p>
        </div>
        <div className="mt-4">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const { name, description, price, image, category, stock } = product;

  return (
    <div className="container mx-auto px-4 py-12">
      <Button onClick={handleGoBack} className={"mb-2"}>
        <ChevronLeft />
        Back to products
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AspectRatio ratio={1 / 1}>
          <Image
            src={image}
            alt={name}
            fill
            className="rounded-md object-cover"
            priority
          />
        </AspectRatio>
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight mb-2">
            {name}
          </h1>
          <div className="text-sm text-muted-foreground mb-4">{category}</div>

          <div className="text-4xl font-bold text-primary mb-6">
            ${price.toFixed(2)}
          </div>

          <div className="flex items-center space-x-2 mb-6">
            <span
              className={`inline-flex items-center space-x-1 rounded-full px-2 py-1 text-xs font-medium ${
                stock > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {stock > 0 ? (
                <>
                  <BadgeCheck className="h-3 w-3" />
                  <span>In Stock ({stock} available)</span>
                </>
              ) : (
                <span>Out of Stock</span>
              )}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="scroll-m-20 text-xl font-semibold tracking-tight mb-2">
              Description
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              {description}
            </p>
          </div>

          {stock > 0 && (
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <div className="px-2 text-lg">{quantity}</div>
                <Button
                  variant="outline"
                  onClick={incrementQuantity}
                  disabled={quantity >= stock}
                >
                  +
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <span className="animate-pulse">Adding to Cart</span>
                    <ShoppingCart className="ml-2 h-4 w-4 animate-pulse" />
                  </>
                ) : (
                  <>
                    <span>Add to Cart</span>
                    <ShoppingCart className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}

          <Separator />

          <div className="mt-8">
            <Tabs defaultValue="description" className="w-full">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  Description
                </h3>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  {description}
                </p>
              </TabsContent>
              <TabsContent value="details">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  Product Details
                </h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold">Category:</span> {category}
                  </div>
                  <div>
                    <span className="font-semibold">In Stock:</span> {stock}{" "}
                    units
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
