import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  
  // Check for authentication using cookies instead of firebase-admin
  const sessionCookie = request.cookies.get('user')
  const isAuthenticated = !!sessionCookie?.value
  
  // Protected routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/post-ad",
    "/listings/create",
    "/listings/edit",
    "/watchlist",
    "/messages",
    "/notifications",
    "/profile",
  ]

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // If the route is protected and the user is not authenticated, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL("/auth/signin", request.url)
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If the user is authenticated and trying to access login/signup, redirect to dashboard
  if (
    isAuthenticated &&
    (request.nextUrl.pathname.startsWith("/auth/signin") || request.nextUrl.pathname.startsWith("/auth/signup"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return res
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/post-ad/:path*",
    "/auth/:path*",
    "/listings/create/:path*",
    "/listings/edit/:path*",
    "/watchlist/:path*",
    "/messages/:path*",
    "/notifications/:path*",
    "/profile/:path*",
  ],
}
