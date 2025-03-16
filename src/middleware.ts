import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const token = request.cookies.get("token")?.value || "";

  const isPublicPath =
    path === "/login" || path === "/register" || path === "/";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/", "/login", "/register", "/products/:path*", "/profile"],
};
