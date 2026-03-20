import { DEMO_JOBS } from "@/lib/demo-data"
import { JobsClient } from "@/components/jobs/jobs-client"

export default async function JobsPage() {
  let jobs = DEMO_JOBS

  try {
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()
    const { data } = await supabase
      .from("job_postings")
      .select("*")
      .eq("status", "open")
      .order("posted_at", { ascending: false })
    if (data && data.length > 0) jobs = data
  } catch {
    // DB not available — use demo data
  }

  return <JobsClient jobs={jobs} />
}
