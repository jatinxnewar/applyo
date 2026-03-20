import { NextResponse } from "next/server"

// Dev-only mock login. Creates a `dev_user` cookie and redirects to /dashboard.
// Enable by setting DEV_MOCK_AUTH=true in your .env.local (only in development).

export async function GET() {
  if (process.env.NODE_ENV === "production" || process.env.DEV_MOCK_AUTH !== "true") {
    return NextResponse.json({ error: "Not available" }, { status: 404 })
  }

  const user = { email: process.env.DEV_MOCK_EMAIL || "dev@example.com", name: process.env.DEV_MOCK_NAME || "Dev User" }
  const devValue = encodeURIComponent(JSON.stringify(user))

  const res = NextResponse.redirect(new URL("/dashboard", process.env.AUTH0_BASE_URL || "http://localhost:3000"))
  // Set cookie accessible to server (HttpOnly not required, but safer)
  res.headers.set("Set-Cookie", `dev_user=${devValue}; Path=/; HttpOnly; SameSite=Lax`)
  return res
}
