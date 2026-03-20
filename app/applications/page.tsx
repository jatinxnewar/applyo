import { getSession } from "@/lib/auth0"
import { redirect } from "next/navigation"
import { DEMO_APPLICATIONS } from "@/lib/demo-data"
import { ApplicationsClient } from "@/components/applications/applications-client"

export default async function ApplicationsPage() {
  const session = await getSession()
  if (!session) redirect("/auth/login")

  let applications = DEMO_APPLICATIONS

  try {
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from("applications")
        .select("*, job:job_postings(*)")
        .eq("user_id", user.id)
        .order("applied_at", { ascending: false })
      if (data && data.length > 0) applications = data
    }
  } catch {
    // DB not available — use demo data
  }

  return <ApplicationsClient applications={applications} />
}
