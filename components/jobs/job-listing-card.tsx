"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { JobPosting } from "@/lib/types"

interface JobListingCardProps {
  job: JobPosting
}

export function JobListingCard({ job }: JobListingCardProps) {
  const daysAgo = Math.floor((Date.now() - new Date(job.posted_at).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className="border border-border/50 hover:border-accent/30 hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium">
                {job.job_type}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{job.description.substring(0, 200)}...</p>
          </div>
          <Link href={`/jobs/${job.id}`}>
            <Button className="bg-accent hover:bg-accent/90 whitespace-nowrap">View & Apply</Button>
          </Link>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border/50">
          <span className="flex items-center gap-1">📍 {job.location}</span>
          {job.salary_range && (
            <span className="flex items-center gap-1">
              💰 ${job.salary_range.min?.toLocaleString()}-${job.salary_range.max?.toLocaleString()}
            </span>
          )}
          <span className="ml-auto">{daysAgo === 0 ? "Today" : `${daysAgo} day${daysAgo !== 1 ? "s" : ""} ago`}</span>
        </div>
      </CardContent>
    </Card>
  )
}
