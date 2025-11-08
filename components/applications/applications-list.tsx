"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Application, JobPosting } from "@/lib/types"

interface ApplicationsListProps {
  applications: (Application & { job: JobPosting })[]
}

export function ApplicationsList({ applications }: ApplicationsListProps) {
  if (applications.length === 0) {
    return (
      <Card className="border border-dashed border-border/50 bg-card/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No applications yet. Start applying to jobs!</p>
        </CardContent>
      </Card>
    )
  }

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
    submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    reviewed: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    accepted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    withdrawn: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id} className="border border-border/50 hover:border-accent/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{application.job?.title}</h3>
                  <Badge className={statusColors[application.status]}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Applied on {new Date(application.applied_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-foreground">
                  {application.job?.location} • {application.job?.job_type}
                </p>
              </div>
              {application.ats_match_score && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-accent">{Math.round(application.ats_match_score)}%</div>
                  <div className="text-xs text-muted-foreground">Match Score</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
