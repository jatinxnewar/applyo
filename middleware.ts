import { NextResponse, type NextRequest } from "next/server"

// Only protect routes if Auth0 is fully configured
const requiredEnvs = ["AUTH0_SECRET", "AUTH0_BASE_URL", "AUTH0_CLIENT_ID", "AUTH0_CLIENT_SECRET"]
const allConfigured = requiredEnvs.every((key) => process.env[key])

export default function middleware(req: NextRequest) {
  // In development with DEV_MOCK_AUTH or missing Auth0 config, allow all protected routes
  if (
    process.env.NODE_ENV === "development" &&
    (process.env.DEV_MOCK_AUTH === "true" || !allConfigured)
  ) {
    return NextResponse.next()
  }

  // If Auth0 is not configured in production, redirect to login
  if (!allConfigured) {
    const loginUrl = new URL("/auth/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Auth0 is configured - for now just allow (we handle auth in pages/API routes)
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/resume/:path*", "/jobs/:path*", "/applications/:path*", "/profile/:path*"],
}
