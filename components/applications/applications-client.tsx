"use client"

import { Navbar } from "@/components/shared/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Application, JobPosting } from "@/lib/types"

interface ApplicationsClientProps {
  applications: (Application & { job: JobPosting })[]
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  draft: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300", dot: "bg-gray-400" },
  submitted: { bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  reviewed: { bg: "bg-yellow-50 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300", dot: "bg-yellow-500" },
  accepted: { bg: "bg-green-50 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", dot: "bg-green-500" },
  rejected: { bg: "bg-red-50 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", dot: "bg-red-500" },
  withdrawn: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300", dot: "bg-gray-400" },
}

export function ApplicationsClient({ applications }: ApplicationsClientProps) {
  const stats = {
    total: applications.length,
    submitted: applications.filter((a) => a.status === "submitted").length,
    reviewed: applications.filter((a) => a.status === "reviewed").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">My Applications</h1>
          <p className="text-sm text-muted-foreground">Track the status of all your job applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total", value: stats.total, color: "text-foreground" },
            { label: "Submitted", value: stats.submitted, color: "text-blue-500" },
            { label: "In Review", value: stats.reviewed, color: "text-yellow-500" },
            { label: "Accepted", value: stats.accepted, color: "text-green-500" },
          ].map((s) => (
            <Card key={s.label} className="border border-border/50">
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Application list */}
        {applications.length === 0 ? (
          <Card className="border border-dashed border-border/50 bg-card/30">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-1">No applications yet</h3>
              <p className="text-sm text-muted-foreground">Start applying to jobs to see them here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const status = statusConfig[app.status] || statusConfig.draft
              return (
                <Card key={app.id} className="border border-border/50 hover:border-accent/20 transition-all duration-200">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                          <h3 className="font-semibold text-foreground">{app.job?.title}</h3>
                          <Badge className={`${status.bg} ${status.text} border-0 gap-1.5`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {app.job?.location}
                          </span>
                          <span className="capitalize">{app.job?.job_type?.replace("-", " ")}</span>
                          <span>Applied {new Date(app.applied_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>
                      </div>
                      {app.ats_match_score != null && (
                        <div className={`text-right px-3 py-1.5 rounded-lg ${
                          app.ats_match_score >= 80
                            ? "bg-green-500/10 text-green-600"
                            : app.ats_match_score >= 60
                              ? "bg-yellow-500/10 text-yellow-600"
                              : "bg-red-500/10 text-red-600"
                        }`}>
                          <div className="text-lg font-bold leading-none">{Math.round(app.ats_match_score)}%</div>
                          <div className="text-[10px] mt-0.5">Match</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
