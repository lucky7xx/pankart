// src/app/layout.js
import { AuthProvider } from "./context/AuthContext";
import Providers from "./providers";
import "./globals.css";
import ReduxProvider from "@/redux/ReduxProvider";
import { Nunito } from "next/font/google";

export const metadata = {
  title: "i-PanKart - Your Online Store",
  description: "Find the best products for the best prices",
  icon: "/favicon.ico",
};

// 1. Configure the Unbounded font
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "600", "700"], // adjust weights as needed
  variable: "--font-nunito", // the CSS variable name
  display: "swap", // optional: control font-display
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body>
        <Providers>
          <AuthProvider>
            <main className="min-h-screen bg-gray-50">
              <ReduxProvider>{children}</ReduxProvider>
            </main>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
