import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ApplicationsList } from "@/components/applications/applications-list"
import Link from "next/link"

export default async function ApplicationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: applications } = await supabase
    .from("applications")
    .select(`
      *,
      job:job_postings(*)
    `)
    .eq("user_id", user.id)
    .order("applied_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="font-bold text-foreground">Applyo</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link href="/jobs" className="text-sm font-medium text-accent">
              Jobs
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Applications</h1>
          <p className="text-muted-foreground">Track the status of all your job applications</p>
        </div>

        <ApplicationsList applications={applications || []} />
      </main>
    </div>
  )
}
