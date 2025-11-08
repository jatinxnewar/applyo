import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Create or update user profile
    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          id: user.id,
          email: user.email,
          ...body,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      )
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

    if (error && error.code === "PGRST116") {
      // Profile doesn't exist yet, create it
      const { data: newProfile } = await supabase
        .from("users")
        .insert({
          id: user.id,
          email: user.email,
          user_type: "professional",
          subscription_tier: "free",
        })
        .select()
        .single()
      return NextResponse.json(newProfile)
    }

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
