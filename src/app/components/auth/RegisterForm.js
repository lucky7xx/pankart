"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Package, CreditCard } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    // Validate password match
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
          })
        );
        router.push("/products");
      } else {
        setFormError(data.error || "Registration failed");
      }
    } catch (error) {
      setFormError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-gray-300 justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Register Form Section */}
        <div className="p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Register</h2>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
                className="w-full border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full border-gray-300 pr-10 focus:border-green-500 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <Label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your password"
                  className="w-full border-gray-300 pr-10 focus:border-green-500 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </div>

        {/* Project Information Section */}
        <div className="hidden lg:flex flex-col justify-center bg-green-900 text-white p-12">
          <div className="max-w-md mx-auto space-y-8 text-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">i-PanKart</h2>
              <p className="text-lg text-green-100 mb-8">
                Your ultimate online shopping destination, bringing convenience
                and variety right to your fingertips.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <ShoppingCart className="h-12 w-12 text-green-300" />
                <div className="text-center">
                  <h3 className="font-semibold text-xl mb-2">
                    Extensive Product Range
                  </h3>
                  <p className="text-green-200 max-w-xs mx-auto">
                    Discover thousands of products across multiple categories.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <Package className="h-12 w-12 text-green-300" />
                <div className="text-center">
                  <h3 className="font-semibold text-xl mb-2">Easy Ordering</h3>
                  <p className="text-green-200 max-w-xs mx-auto">
                    Simple, intuitive interface for a seamless shopping
                    experience.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <CreditCard className="h-12 w-12 text-green-300" />
                <div className="text-center">
                  <h3 className="font-semibold text-xl mb-2">
                    Secure Payments
                  </h3>
                  <p className="text-green-200 max-w-xs mx-auto">
                    Multiple payment options with top-notch security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
