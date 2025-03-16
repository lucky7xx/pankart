"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "../components/navbar/page";

const CheckoutPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const cartItems = useSelector((state) => state.cart.items);
  const router = useRouter();

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    if (cartItems.length > 0) {
      fetchPaymentIntent();
    } else {
      router.push("/cart");
    }
  }, [cartItems]);

  const fetchPaymentIntent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cartItems }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error creating payment intent");
      }

      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  const handleChange = (event) => {
    // display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    for (const field in shippingAddress) {
      if (!shippingAddress[field]) {
        setError(`Please enter your ${field}`);
        return;
      }
    }

    setProcessing(true);

    try {
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (payload.error) {
        setError(`Payment failed: ${payload.error.message}`);
        setProcessing(false);
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentIntentId: payload.paymentIntent.id,
            cartItems,
            shippingAddress,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error creating order");
      }

      setSucceeded(true);
      setError(null);
      setProcessing(false);

      router.push("/checkout/success");
    } catch (error) {
      console.error("Error processing payment:", error);
      setError(error.message);
      setProcessing(false);
    }
  };
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>Enter your shipping details</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      placeholder="United States"
                      required
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>
                Enter your card details to complete your purchase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-3 border rounded-md">
                <CardElement
                  id="card-element"
                  options={cardStyle}
                  onChange={handleChange}
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              {succeeded && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                  Payment successful! Creating your order...
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>
                  Subtotal (
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}{" "}
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
            <Button
              className="w-full"
              disabled={processing || disabled || succeeded}
              onClick={handleSubmit}
            >
              {processing ? "Processing..." : "Pay Now"}
            </Button>
          </CardFooter>
        </Card>
      </div>{" "}
    </>
  );
};

export default CheckoutPage;
