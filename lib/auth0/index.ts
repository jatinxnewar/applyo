import { getSession as auth0GetSession, getAccessToken as auth0GetAccessToken, updateSession as auth0UpdateSession, touchSession as auth0TouchSession, handleAuth as auth0HandleAuth, handleLogin as auth0HandleLogin, handleLogout as auth0HandleLogout, handleCallback as auth0HandleCallback, handleProfile as auth0HandleProfile, withApiAuthRequired as auth0WithApiAuthRequired, withPageAuthRequired as auth0WithPageAuthRequired } from "@auth0/nextjs-auth0"
import { cookies } from "next/headers"

// Wrapper around @auth0/nextjs-auth0 so we can provide a developer mock session
// when AUTH0 is not configured (local/dev). Use by setting DEV_MOCK_AUTH=true
// and creating a cookie named `dev_user` with a URI encoded JSON value: { name, email }

export async function getSession(...args: any[]) {
  try {
    // @ts-ignore - Auth0 SDK typing issue
    const s = await auth0GetSession(...args)
    if (s) return s
  } catch (e) {
    // fallthrough to dev mock
  }

  if (process.env.NODE_ENV !== "production" && process.env.DEV_MOCK_AUTH === "true") {
    try {
      const cookieStore: any = (cookies as any)()
      const dev = cookieStore.get("dev_user")?.value
      if (dev) {
        const parsed = JSON.parse(decodeURIComponent(dev))
        const user = {
          sub: `dev|${parsed.email}`,
          name: parsed.name || parsed.email,
          email: parsed.email,
        }
        // Return an object resembling Auth0 session shape used across the app
        return { user }
      }
    } catch (err) {
      // ignore
    }
  }

  return null
}

// Re-export other helpers directly from Auth0
export const getAccessToken = auth0GetAccessToken
export const updateSession = auth0UpdateSession
export const touchSession = auth0TouchSession
export const handleAuth = auth0HandleAuth
export const handleLogin = auth0HandleLogin
export const handleLogout = auth0HandleLogout
export const handleCallback = auth0HandleCallback
export const handleProfile = auth0HandleProfile
export const withApiAuthRequired = auth0WithApiAuthRequired
export const withPageAuthRequired = auth0WithPageAuthRequired
