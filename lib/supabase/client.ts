"use client"

// Lightweight client-side compatibility wrapper so existing UI components
// that import `createClient` still work. This uses Auth0 endpoints for
// sign-in/out and falls back to calling our server APIs for data operations.

export function createClient() {
  return {
    auth: {
      async signInWithPassword(_: { email: string; password: string }) {
        // Password-based sign in is not implemented in this migration.
        return { error: { message: "Password sign-in is not supported. Use Auth0 login." } }
      },
      async signOut() {
        // Redirect to Auth0 logout endpoint handled by our API route
        if (typeof window !== "undefined") {
          window.location.href = "/api/auth/logout"
        }
      },
      async signInWithOAuth(provider: string) {
        if (typeof window !== "undefined") {
          window.location.href = `/api/auth/login?connection=${encodeURIComponent(provider)}`
        }
      },
    },

    // Client-side data helper that calls our server endpoints under /api
    from(collectionName: string) {
      return {
        async select(_fields?: string) {
          const res = await fetch(`/api/mongo/${collectionName}`, { method: "GET" })
          return res.json()
        },
      }
    },
  }
}

export function getClient() {
  return createClient()
}
