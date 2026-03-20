import { notFound } from "next/navigation"
import { DEMO_JOBS, DEMO_RESUMES } from "@/lib/demo-data"
import { JobDetailClient } from "@/components/jobs/job-detail-client"

interface JobDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params

  let job = DEMO_JOBS.find((j) => j.id === id) || null
  let resumes = DEMO_RESUMES

  try {
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()
    const { data: dbJob } = await supabase.from("job_postings").select("*").eq("id", id).single()
    if (dbJob) job = dbJob

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from("resumes").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      if (data && data.length > 0) resumes = data
    }
  } catch {
    // DB not available — use demo data
  }

  if (!job) notFound()

  return <JobDetailClient job={job} resumes={resumes} />
}
