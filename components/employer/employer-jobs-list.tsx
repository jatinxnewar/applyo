"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { JobPosting } from "@/lib/types"

interface EmployerJobsListProps {
  jobs: JobPosting[]
}

export function EmployerJobsList({ jobs }: EmployerJobsListProps) {
  if (jobs.length === 0) {
    return (
      <Card className="border border-dashed border-border/50 bg-card/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No job postings yet</p>
          <Link href="/employer/jobs/create">
            <Button className="bg-accent hover:bg-accent/90">Post Your First Job</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {jobs.map((job) => (
        <Card key={job.id} className="border border-border/50 hover:border-accent/30 transition-colors">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.location}</p>
              </div>

              <p className="text-sm text-foreground/80 line-clamp-2">{job.description}</p>

              <div className="flex gap-2">
                <Link href={`/employer/jobs/${job.id}/applicants`} className="flex-1">
                  <Button variant="outline" className="w-full text-sm bg-transparent">
                    View Applicants
                  </Button>
                </Link>
                <Button variant="outline" className="text-sm bg-transparent">
                  Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
