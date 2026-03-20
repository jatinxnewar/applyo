"use server"

import { handleAuth, handleLogin, handleLogout, handleCallback } from "@/lib/auth0"
import { getDatabase } from "@/lib/mongodb/client"

// Build the auth handler lazily so we don't call `handleAuth` at module init time
// (which fails when required env vars like the cookie secret are missing).
function createAuthHandler() {
  return handleAuth({
    login: handleLogin({
      authorizationParams: {
        screen_hint: "signup",
        connection: "google-oauth2",
      },
    }),
    logout: handleLogout({
      returnTo: process.env.AUTH0_BASE_URL,
    }),
    callback: handleCallback({
      async afterCallback(req: any, session: any, state: any) {
        try {
          const db = await getDatabase()
          const usersCollection = db.collection("users")

          await usersCollection.updateOne(
            { auth0_id: session.user.sub },
            {
              $set: {
                auth0_id: session.user.sub,
                email: session.user.email,
                name: session.user.name,
                picture: session.user.picture,
                updated_at: new Date(),
              },
              $setOnInsert: {
                created_at: new Date(),
                user_type: "student",
              },
            },
            { upsert: true },
          )
        } catch (error) {
          console.error("[v0] MongoDB upsert error:", error)
        }

        return session
      },
    }),
  })
}

const REQUIRED_AUTH0_ENVS = [
  "AUTH0_DOMAIN",
  "AUTH0_CLIENT_ID",
  "AUTH0_CLIENT_SECRET",
  "AUTH0_BASE_URL",
  "AUTH0_SECRET",
]

export async function GET(request: Request) {
  const url = new URL(request.url)
  const isLogout = url.pathname.endsWith("/logout")

  // Handle logout for demo users: clear the dev_user cookie and redirect
  if (isLogout) {
    const hasCookie = request.headers.get("cookie")?.includes("dev_user")
    const missing = REQUIRED_AUTH0_ENVS.filter((k) => !process.env[k])
    if (hasCookie || missing.length > 0) {
      const baseUrl = process.env.AUTH0_BASE_URL || "http://localhost:3000"
      return new Response(null, {
        status: 302,
        headers: {
          Location: `${baseUrl}/auth/login`,
          "Set-Cookie": "dev_user=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
        },
      })
    }
  }

  const missing = REQUIRED_AUTH0_ENVS.filter((k) => !process.env[k])
  if (missing.length > 0) {
    return new Response(null, { status: 302, headers: { Location: "/auth/login" } })
  }

  const authHandler = createAuthHandler()
  return authHandler(request as any)
}
