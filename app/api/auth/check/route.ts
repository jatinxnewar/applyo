import { NextResponse } from "next/server"

const REQUIRED_AUTH0_ENVS = [
  "AUTH0_DOMAIN",
  "AUTH0_CLIENT_ID",
  "AUTH0_CLIENT_SECRET",
  "AUTH0_BASE_URL",
  "AUTH0_SECRET",
]

export async function GET() {
  const missing = REQUIRED_AUTH0_ENVS.filter((k) => !process.env[k])
  if (missing.length > 0) {
    return NextResponse.json({ ok: false, missing })
  }

  return NextResponse.json({ ok: true })
}
