import { NextResponse } from "next/server"

export async function GET() {
  // Block mock login only in production when Auth0 IS configured
  const auth0Configured = ["AUTH0_SECRET", "AUTH0_BASE_URL", "AUTH0_CLIENT_ID", "AUTH0_CLIENT_SECRET"].every(
    (k) => process.env[k]
  )
  if (process.env.NODE_ENV === "production" && auth0Configured) {
    return NextResponse.json({ error: "Not available" }, { status: 404 })
  }

  const user = {
    email: process.env.DEV_MOCK_EMAIL || "demo@applyo.com",
    name: process.env.DEV_MOCK_NAME || "Alex Johnson",
  }
  const devValue = encodeURIComponent(JSON.stringify(user))

  // Try to upsert the user in MongoDB
  try {
    const { getDatabase } = await import("@/lib/mongodb/client")
    const db = await getDatabase()
    const usersCollection = db.collection("users")
    const auth0Id = `dev|${user.email}`
    await usersCollection.updateOne(
      { auth0_id: auth0Id },
      {
        $set: {
          email: user.email,
          full_name: user.name,
          auth0_id: auth0Id,
          user_type: "professional",
          subscription_tier: "pro",
          updated_at: new Date(),
        },
        $setOnInsert: { created_at: new Date() },
      },
      { upsert: true }
    )
  } catch {
    // MongoDB not available — the dashboard will fall back to demo data
  }

  const baseUrl = process.env.AUTH0_BASE_URL || "http://localhost:3000"
  const res = NextResponse.redirect(new URL("/dashboard", baseUrl))
  res.headers.set("Set-Cookie", `dev_user=${devValue}; Path=/; HttpOnly; SameSite=Lax`)
  return res
}
