"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, Package, CreditCard } from "lucide-react";
import { login } from "@/redux/slices/authSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const dispatch = useDispatch(); // Add dispatch

  // Check for remembered credentials on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Dispatch login action to update Redux state
        dispatch(
          login({
            user: {
              _id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
            },
            token: data.token,
          })
        );

        // Store authentication data in localStorage
        document.cookie = `token=${data.token}; path=/; max-age=86400`; // 24 hours
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
        // Handle error
        setError(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Login Form Section */}
        <div className="p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex justify-between items-center mb-2">
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
              </div>
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

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                  className="text-green-600"
                />
                <Label htmlFor="remember-me" className="text-sm text-gray-600">
                  Remember me
                </Label>
              </div>
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? "Logging in..." : "Login"}
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
