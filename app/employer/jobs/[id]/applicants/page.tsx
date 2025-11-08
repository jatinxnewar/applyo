import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { ApplicantsList } from "@/components/employer/applicants-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ApplicantsPageProps {
  params: Promise<{ id: string }>
}

export default async function ApplicantsPage({ params }: ApplicantsPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get job details
  const { data: job } = await supabase.from("job_postings").select("*").eq("id", id).eq("employer_id", user.id).single()

  if (!job) {
    notFound()
  }

  // Get applications with applicant details
  const { data: applications } = await supabase
    .from("applications")
    .select(`
      *,
      user:users(*),
      resume:resumes(*)
    `)
    .eq("job_id", id)
    .order("applied_at", { ascending: false })

  // Get tracking history
  const { data: tracking } = await supabase
    .from("applicant_tracking")
    .select("*")
    .in("application_id", applications?.map((a) => a.id) || [])
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/employer/jobs" className="flex items-center gap-2">
            <Button variant="ghost">←</Button>
            <div>
              <h1 className="font-bold text-foreground">{job.title}</h1>
              <p className="text-xs text-muted-foreground">
                {applications?.length || 0} applicant{applications?.length !== 1 ? "s" : ""}
              </p>
            </div>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <ApplicantsList applications={applications || []} tracking={tracking || []} jobId={id} />
      </main>
    </div>
  )
}
