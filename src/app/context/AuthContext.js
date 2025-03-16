"use client";

import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on initial load
    checkUserLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("token", data.token);
        setLoading(false);
        return true;
      } else {
        setError(data.error || "Registration failed");
        setLoading(false);
        return false;
      }
    } catch (error) {
      setError("Something went wrong");
      setLoading(false);
      return false;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("token", data.token);
        setLoading(false);
        return true;
      } else {
        setError(data.error || "Invalid credentials");
        setLoading(false);
        return false;
      }
    } catch (error) {
      setError("Something went wrong");
      setLoading(false);
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  // Check if user is logged in
  const checkUserLoggedIn = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setUser(data.data);
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    }

    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
