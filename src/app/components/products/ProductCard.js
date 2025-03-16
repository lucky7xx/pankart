"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (user) {
      try {
        setIsLoading(true);

        dispatch(
          addToCart({
            product,
            quantity: 1,
            userId: user._id,
          })
        );

        alert("Item added to cart!");
      } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Failed to add item to cart");
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please log in to add items to cart");
    }
  };

  return (
    <Card
      className="w-full h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg 
      sm:max-w-[300px] mx-auto 
      border-gray-200 
      shadow-sm 
      rounded-lg"
    >
      {/* Product Image - Fully Responsive */}
      <CardHeader className="p-0 relative group w-full">
        <Link href={`/products/${product._id}`} className="block w-full">
          <div className="relative w-full pb-[100%] overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="absolute inset-0 object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </Link>
      </CardHeader>

      {/* Product Details - Mobile-First Typography */}
      <CardContent className="px-3 py-3 flex-grow flex flex-col space-y-2">
        <Link href={`/products/${product._id}`}>
          <h3 className="text-sm sm:text-base font-semibold mb-1 line-clamp-1 text-gray-800 hover:text-green-600">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 flex-grow mb-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base font-bold text-green-600">
            ${product.price.toFixed(2)}
          </span>

          <Badge
            variant={product.stock > 0 ? "default" : "destructive"}
            className="text-[10px] sm:text-xs"
          >
            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
          </Badge>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="p-3">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isLoading}
          className="w-full text-xs sm:text-sm py-2 h-auto"
          variant={product.stock > 0 ? "default" : "outline"}
        >
          <ShoppingCart className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          {isLoading
            ? "Adding..."
            : product.stock > 0
            ? "Add to Cart"
            : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}
