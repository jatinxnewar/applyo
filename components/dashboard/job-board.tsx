"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { JobPosting } from "@/lib/types"

interface JobBoardProps {
  jobs: JobPosting[]
}

export function JobBoard({ jobs }: JobBoardProps) {
  if (jobs.length === 0) {
    return (
      <Card className="border border-dashed border-border/50 bg-card/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No jobs available at the moment</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id} className="border border-border/50 hover:border-accent/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-foreground text-lg">{job.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium">
                    {job.job_type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{job.description.substring(0, 150)}...</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>📍 {job.location}</span>
                  {job.salary_range && (
                    <span>
                      💰 ${job.salary_range.min?.toLocaleString()}-${job.salary_range.max?.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <Link href={`/jobs/${job.id}`}>
                <Button className="bg-accent hover:bg-accent/90 whitespace-nowrap">Apply Now</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
