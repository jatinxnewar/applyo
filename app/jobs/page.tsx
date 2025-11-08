import { createClient } from "@/lib/supabase/server"
import { JobBoardHeader } from "@/components/jobs/job-board-header"
import { JobListingCard } from "@/components/jobs/job-listing-card"
import { Card, CardContent } from "@/components/ui/card"

export default async function JobsPage() {
  const supabase = await createClient()

  const { data: jobs } = await supabase
    .from("job_postings")
    .select("*")
    .eq("status", "open")
    .order("posted_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <JobBoardHeader />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <Card className="border border-border/50 sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Filters</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span className="text-sm">Full-time</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span className="text-sm">Part-time</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span className="text-sm">Contract</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span className="text-sm">Internship</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            {jobs && jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobListingCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <Card className="border border-dashed border-border/50 bg-card/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">No jobs available at the moment</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
