import { getSession } from "@auth0/nextjs-auth0"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getSession()

  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", process.env.AUTH0_BASE_URL))
  }

  return NextResponse.redirect(new URL("/dashboard", process.env.AUTH0_BASE_URL))
}
