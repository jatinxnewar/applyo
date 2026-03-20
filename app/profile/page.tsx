import { getSession } from "@/lib/auth0"
import { redirect } from "next/navigation"
import { DEMO_USER } from "@/lib/demo-data"
import { ProfileClient } from "@/components/profile/profile-client"

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) redirect("/auth/login")

  let user = DEMO_USER

  try {
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      const { data: userProfile } = await supabase.from("users").select("*").eq("id", authUser.id).single()
      if (userProfile) user = { ...DEMO_USER, ...userProfile }
    }
  } catch {
    // DB not available — use demo data
  }

  return <ProfileClient user={user} />
}
