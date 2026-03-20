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
      <Card className="border border-dashed border-border/50 bg-card/30">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-foreground mb-1">No jobs available</h3>
          <p className="text-sm text-muted-foreground">Check back later for new opportunities</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => {
        const daysAgo = Math.floor((Date.now() - new Date(job.posted_at).getTime()) / (1000 * 60 * 60 * 24))
        const timeLabel = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`

        return (
          <Card key={job.id} className="border border-border/50 hover:border-accent/30 hover:shadow-sm transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                    <h3 className="font-semibold text-foreground">{job.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium capitalize">
                      {job.job_type.replace("-", " ")}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto hidden sm:block">{timeLabel}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{job.description.substring(0, 160)}...</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </span>
                    {job.salary_range && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ${job.salary_range.min?.toLocaleString()} - ${job.salary_range.max?.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <Link href={`/jobs/${job.id}`} className="shrink-0">
                  <Button size="sm" className="bg-accent hover:bg-accent/90 text-white whitespace-nowrap">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
