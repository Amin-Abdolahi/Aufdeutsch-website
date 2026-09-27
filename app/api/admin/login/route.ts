import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();

  const validPassword = process.env.ADMIN_PASSWORD;

  if (!validPassword || password !== validPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // Set secure cookie
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_auth", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}