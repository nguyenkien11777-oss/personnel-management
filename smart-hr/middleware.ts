import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // chưa đăng nhập
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = token.role;

  // employee không được vào dashboard
  if (pathname.startsWith("/dashboard") && role === "employee") {
    return NextResponse.redirect(new URL("/me", req.url));
  }

  // admin/hr/manager không vào portal employee
  if (pathname.startsWith("/me") && role !== "employee") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/me/:path*"],
};