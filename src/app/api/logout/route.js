import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: request.headers.get("authorization") || "",
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      const res = NextResponse.json(data);
      res.cookies.delete("token");
      return res;
    } else {
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}
