"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, LogOut } from "lucide-react";

const ProfilePage = () => {
  const router = useRouter();

  // Fetch user profile
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return null;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return response.json();
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });

  // Logout function
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        window.location.href = "/login";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription>
              Failed to load your profile: {error.message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = data?.data;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-500">Full Name</h3>
                  <p className="text-lg">{user?.name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Email</h3>
                  <p className="text-lg">{user?.email}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Account Type</h3>
                  <p className="text-lg capitalize">{user?.role}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Member Since</h3>
                  <p className="text-lg">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                <Link href="/profile/orders">
                  <div className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-md cursor-pointer">
                    <Package className="h-5 w-5 mr-3" />
                    <span className="font-medium">My Orders</span>
                  </div>
                </Link>
                <div
                  className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span className="font-medium">Logout</span>
                </div>
              </nav>
            </CardContent>
          </Card>

          {user?.role === "admin" && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Admin</CardTitle>
                <CardDescription>Manage store</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/dashboard">
                  <div className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md cursor-pointer">
                    <span className="font-medium">Go to Admin Dashboard</span>
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
