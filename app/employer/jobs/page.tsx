import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EmployerHeader } from "@/components/employer/employer-header"
import { EmployerJobsList } from "@/components/employer/employer-jobs-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function EmployerJobsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is employer
  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (userProfile?.user_type === "student") {
    redirect("/dashboard")
  }

  // Get employer's job postings
  const { data: jobs } = await supabase
    .from("job_postings")
    .select("*")
    .eq("employer_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <EmployerHeader />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Your Job Postings</h1>
              <p className="text-muted-foreground">Manage your job postings and track applicants</p>
            </div>
            <Link href="/employer/jobs/create">
              <Button className="bg-accent hover:bg-accent/90">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Post Job
              </Button>
            </Link>
          </div>

          <EmployerJobsList jobs={jobs || []} />
        </div>
      </main>
    </div>
  )
}
