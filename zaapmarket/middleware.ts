// /middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check if the user is trying to access a protected route
  const isProtectedRoute = path.startsWith("/dashboard");

  // Get the session token
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (isProtectedRoute && !session) {
    // Redirect to the login page if the user is not authenticated
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Specify the routes where the middleware should apply
export const config = {
  matcher: ["/dashboard/:path*"], // Apply middleware to all dashboard routes
};