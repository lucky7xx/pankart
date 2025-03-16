"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/slices/cartSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const CheckoutSuccessPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear the cart after successful checkout
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
          <CardDescription>
            Thank you for your purchase. Your order has been received and is
            being processed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            You will receive an email confirmation with the details of your
            order shortly.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button onClick={() => router.push("/products")}>
            Continue Shopping
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/profile/orders")}
          >
            View Orders
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CheckoutSuccessPage;
