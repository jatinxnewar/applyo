import { getSession } from "@/lib/auth0"
import { getDatabase } from "@/lib/mongodb/client"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    const user = await usersCollection.findOne({ auth0_id: session.user.sub })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const db = await getDatabase()
    const usersCollection = db.collection("users")

    const result = await usersCollection.updateOne(
      { auth0_id: session.user.sub },
      {
        $set: {
          ...body,
          updated_at: new Date(),
        },
      },
    )

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
