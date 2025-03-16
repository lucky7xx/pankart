"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../redux/slices/cartSlice";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus } from "lucide-react";
import Navbar from "../components/navbar/page";

const CartPage = () => {
  const { items: cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Filter cart items for current user
  const userCartItems = cartItems.filter((item) => item.userId === user?._id);

  const handleRemoveItem = (productId) => {
    dispatch(
      removeFromCart({
        productId,
        userId: user._id,
      })
    );
  };

  const handleUpdateQuantity = (productId, quantity) => {
    // Ensure quantity is at least 1
    const validQuantity = Math.max(1, quantity);

    dispatch(
      updateQuantity({
        productId,
        quantity: validQuantity,
        userId: user._id,
      })
    );
  };

  const calculateTotal = () => {
    return userCartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  // Check if user is logged in
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Please Log In</CardTitle>
            <CardDescription>
              You need to be logged in to view your cart.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Shopping Cart</h1>
          <Link href="/products">
            <Button variant="outline">Back to Products</Button>
          </Link>
        </div>

        {userCartItems.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Your cart is empty</CardTitle>
              <CardDescription>
                Looks like you haven&apos;t added any items to your cart yet.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            {userCartItems.map((item) => (
              <Card key={item.product._id} className="mb-4">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-24 w-24 rounded overflow-hidden flex-shrink-0 mr-4 mb-3 sm:mb-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded"
                      />
                    </div>

                    <div className="flex flex-col flex-grow">
                      <CardTitle className="text-lg mb-1">
                        {item.product.name}
                      </CardTitle>
                      <CardDescription className="mb-2">
                        Price: ${item.product.price.toFixed(2)}
                      </CardDescription>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity === 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                item.product._id,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-16 text-center"
                            min="1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-4 font-medium">
                            Total: $
                            {(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            onClick={() => handleRemoveItem(item.product._id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>
                      Subtotal (
                      {userCartItems.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}{" "}
                      items)
                    </span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/checkout">
                  <Button className="w-full">Proceed to Checkout</Button>
                </Link>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </>
  );
};

export default CartPage;
