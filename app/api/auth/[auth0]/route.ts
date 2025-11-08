"use server"

import { handleAuth, handleLogin, handleLogout, handleCallback } from "@auth0/nextjs-auth0"
import { getDatabase } from "@/lib/mongodb/client"

export const GET = handleAuth({
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
    async afterCallback(req, session, state) {
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
