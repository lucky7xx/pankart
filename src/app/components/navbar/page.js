"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Get cart items and user from Redux
  const { items: cartItems } = useSelector((state) => state.cart);
  const { user: reduxUser } = useSelector((state) => state.auth);

  // Calculate cart item count for current user
  const cartItemCount = cartItems.reduce((total, item) => {
    // Only count items for the current user
    return item.userId === reduxUser?._id ? total + item.quantity : total;
  }, 0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setUser(null);
        window.location.href = "/login";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleGoToCart = () => {
    router.push("/cart");
  };

  return (
    <header className="bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/products" className="flex items-center space-x px-2">
          <span className="font-bold">I-PanKart</span>
        </Link>

        {/* Desktop Cart Button - Only visible on small screens but outside the mobile menu */}
        <Button
          variant="ghost"
          className="relative mr-2 sm:mr-0 md:hidden"
          onClick={handleGoToCart}
        >
          <ShoppingCart className="h-6 w-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {cartItemCount}
            </span>
          )}
        </Button>

        {/* Mobile Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent position="right" size="full">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="px-4 py-3 space-y-1">
              {user ? (
                <>
                  <Link
                    href="/products"
                    className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/cart"
                    className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cart {cartItemCount > 0 && `(${cartItemCount})`}
                  </Link>

                  {user.role === "admin" && (
                    <Link
                      href="/admin/dashboard"
                      className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground font-semibold"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="secondary" className="w-full">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex md:items-center md:justify-end md:space-x-4">
          {user ? (
            <>
              <Link
                href="/products"
                className="text-muted-foreground hover:text-foreground"
              >
                Products
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className="text-muted-foreground hover:text-foreground font-semibold"
                >
                  Admin Dashboard
                </Link>
              )}
              <Button
                variant="ghost"
                className="relative"
                onClick={handleGoToCart}
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {cartItemCount}
                  </span>
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground"
              >
                Login
              </Link>
              <Link href="/register">
                <Button variant="secondary">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
