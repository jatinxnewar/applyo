import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (userProfile?.user_type !== "admin") {
    redirect("/dashboard")
  }

  // Get platform statistics
  const { data: users } = await supabase.from("users").select("count", { count: "exact" })

  const { data: jobs } = await supabase.from("job_postings").select("count", { count: "exact" })

  const { data: applications } = await supabase.from("applications").select("count", { count: "exact" })

  const { data: resumes } = await supabase.from("resumes").select("count", { count: "exact" })

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform overview and management tools</p>
          </div>

          <AdminDashboard
            stats={{
              totalUsers: users?.length || 0,
              totalJobs: jobs?.length || 0,
              totalApplications: applications?.length || 0,
              totalResumes: resumes?.length || 0,
            }}
          />
        </div>
      </main>
    </div>
  )
}
