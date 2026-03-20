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
  const missing = REQUIRED_AUTH0_ENVS.filter((k) => !process.env[k])
  if (missing.length > 0) {
    // In development, avoid an opaque 500: redirect developer to the local login page
    // so they can at least exercise the UI while envs are not set.
    if (process.env.NODE_ENV === "development") {
      return new Response(null, { status: 302, headers: { Location: "/auth/login" } })
    }

    // In non-dev environments, return a clear JSON error so deploys fail loudly and
    // the missing environment variables can be fixed.
    return new Response(
      JSON.stringify({ error: "Missing Auth0 env variables", missing }),
      { status: 500, headers: { "content-type": "application/json" } },
    )
  }

  // Create the auth handler now that we know env vars are present and delegate to it.
  // Note: createAuthHandler returns a function that is compatible with the App Router
  // Request handler signature.
  const authHandler = createAuthHandler()
  return authHandler(request as any)
}
