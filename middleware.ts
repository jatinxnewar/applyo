import { NextResponse, type NextRequest } from "next/server"

const requiredEnvs = ["AUTH0_SECRET", "AUTH0_BASE_URL", "AUTH0_CLIENT_ID", "AUTH0_CLIENT_SECRET"]
const allConfigured = requiredEnvs.every((key) => process.env[key])

export default function middleware(req: NextRequest) {
  // In development or with DEV_MOCK_AUTH, allow all protected routes
  if (process.env.DEV_MOCK_AUTH === "true" || !allConfigured) {
    return NextResponse.next()
  }

  // Auth0 is configured — let page-level auth handle redirects
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/resume/:path*", "/jobs/:path*", "/applications/:path*", "/profile/:path*"],
}
