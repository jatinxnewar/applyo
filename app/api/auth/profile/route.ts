import { getSession } from "@/lib/auth0"
import { type NextRequest, NextResponse } from "next/server"
import { DEMO_USER } from "@/lib/demo-data"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { getDatabase } = await import("@/lib/mongodb/client")
    const db = await getDatabase()
    const user = await db.collection("users").findOne({ auth0_id: session.user.sub })
    if (user) {
      return NextResponse.json({ ...user, id: user._id.toString() })
    }
  } catch {
    // DB not available
  }

  // Fallback to demo user with session info
  return NextResponse.json({
    ...DEMO_USER,
    email: session.user.email || DEMO_USER.email,
    full_name: session.user.name || DEMO_USER.full_name,
  })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  try {
    const { getDatabase } = await import("@/lib/mongodb/client")
    const db = await getDatabase()
    await db.collection("users").updateOne(
      { auth0_id: session.user.sub },
      { $set: { ...body, updated_at: new Date() } },
      { upsert: true }
    )
    return NextResponse.json({ success: true })
  } catch {
    // DB not available — return success for demo
    return NextResponse.json({ success: true, demo: true })
  }
}
