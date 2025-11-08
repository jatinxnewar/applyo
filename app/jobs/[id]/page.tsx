import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { JobApplicationForm } from "@/components/jobs/job-application-form"
import { JobDetailsEnhanced } from "@/components/jobs/job-details-enhanced"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"

interface JobDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: job } = await supabase.from("job_postings").select("*").eq("id", id).single()

  if (!job) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user's resumes for application
  const { data: resumes } = user
    ? await supabase.from("resumes").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
    : { data: [] }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/jobs">
            <Button variant="ghost" className="mb-4">
              ← Back to Jobs
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2">
            <Card className="border border-border/50">
              <CardHeader>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-foreground">{job.title}</h1>
                    <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                      {job.job_type}
                    </span>
                  </div>
                  <p className="text-muted-foreground">📍 {job.location}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-3">Job Description</h2>
                  <p className="text-foreground/80 whitespace-pre-wrap">{job.description}</p>
                </div>

                {job.requirements && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-3">Requirements</h2>
                    <p className="text-foreground/80 whitespace-pre-wrap">{job.requirements}</p>
                  </div>
                )}

                {job.salary_range && (
                  <div className="bg-card/50 p-4 rounded-lg border border-border/50">
                    <p className="text-sm text-muted-foreground">Salary Range</p>
                    <p className="text-2xl font-bold text-accent">
                      ${job.salary_range.min?.toLocaleString()} - ${job.salary_range.max?.toLocaleString()}
                    </p>
                  </div>
                )}

                <JobDetailsEnhanced job={job} />
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-1">
            <JobApplicationForm jobId={job.id} resumes={resumes || []} />
          </div>
        </div>
      </main>
    </div>
  )
}
