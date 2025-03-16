"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Package, CreditCard, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SimpleLandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Akshay Trivedi",
      role: "Regular Customer",
      content:
        "i-PanKart has transformed my shopping experience. The variety of products and ease of use make it my go-to for all shopping needs.",
    },
    {
      id: 2,
      name: "Ronak Pandya",
      role: "Tech Enthusiast",
      content:
        "As someone who loves gadgets, I appreciate the extensive electronics section. Fast shipping and excellent customer service!",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-900">i-PanKart</h1>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-green-600">
                Home
              </Link>
              <Link href="/" className="text-gray-700 hover:text-green-600">
                Products
              </Link>
              <Link href="/" className="text-gray-700 hover:text-green-600">
                About
              </Link>
              <Link href="/" className="text-gray-700 hover:text-green-600">
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="hidden md:flex border-green-600 text-green-600 hover:bg-green-50"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => router.push("/register")}
              >
                Register
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t">
              <ul className="space-y-4">
                <li>
                  <Link href="/" className="text-gray-700 hover:text-green-600">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-700 hover:text-green-600">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-700 hover:text-green-600">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-700 hover:text-green-600">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-green-600"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>

      <section className="bg-green-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Welcome to i-PanKart
              </h1>
              <p className="text-lg text-green-100 mb-6 max-w-lg">
                Your ultimate online shopping destination, bringing convenience
                and variety right to your fingertips.
              </p>
              <div className="flex gap-4">
                <Button
                  className="bg-white text-green-900 hover:bg-gray-100"
                  onClick={() => router.push("/products")}
                >
                  Shop Now
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-green-900 hover:bg-green-800"
                  onClick={() => router.push("/register")}
                >
                  Sign Up
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-sm h-60">
                <Image
                  src="/illustration.png"
                  alt="Shopping illustration"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              About i-PanKart
            </h2>
            <p className="text-gray-600 mb-8">
              i-PanKart is a leading online shopping platform offering a wide
              range of products across multiple categories. We&apos;re committed
              to providing an exceptional shopping experience with secure
              payments, fast delivery, and excellent customer service.
            </p>
            <p className="text-gray-600">
              Whether you&apos;re looking for the latest electronics, trendy
              fashion items, or everyday essentials, i-PanKart has you covered.
              Join our growing community of satisfied customers and discover a
              better way to shop online.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
            Why Shop With Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded shadow-sm flex flex-col items-center text-center">
              <ShoppingCart className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Extensive Product Range
              </h3>
              <p className="text-gray-600">
                Discover thousands of products across multiple categories, from
                electronics to fashion and more.
              </p>
            </div>

            <div className="bg-white p-6 rounded shadow-sm flex flex-col items-center text-center">
              <Package className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Ordering</h3>
              <p className="text-gray-600">
                Simple, intuitive interface for a seamless shopping experience
                with fast delivery.
              </p>
            </div>

            <div className="bg-white p-6 rounded shadow-sm flex flex-col items-center text-center">
              <CreditCard className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Multiple payment options with top-notch security to keep your
                information safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
            Customer Testimonials
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-gray-200">
                <CardContent className="p-6">
                  <p className="text-gray-700 italic mb-4">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-green-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-green-100 mb-6 max-w-lg mx-auto">
            Join thousands of satisfied customers and experience the best online
            shopping platform.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              className="bg-white text-green-900 hover:bg-gray-100"
              onClick={() => router.push("/register")}
            >
              Sign Up
            </Button>
            <Button
              variant="outline"
              className="bg-white text-green-900 hover:bg-gray-100"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-3">i-PanKart</h3>
              <p className="text-gray-400">
                Your ultimate online shopping destination, bringing convenience
                and variety right to your fingertips.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Contact Us</h4>
              <p className="text-gray-400">Email: support@ipankart.com</p>
              <p className="text-gray-400">Phone: +91 872347896</p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} i-PanKart. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
