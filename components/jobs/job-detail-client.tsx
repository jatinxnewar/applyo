"use client"

import { useState } from "react"
import { Navbar } from "@/components/shared/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { JobPosting, Resume } from "@/lib/types"

interface JobDetailClientProps {
  job: JobPosting
  resumes: Resume[]
}

export function JobDetailClient({ job, resumes }: JobDetailClientProps) {
  const [selectedResume, setSelectedResume] = useState(resumes[0]?.id || "")
  const [applied, setApplied] = useState(false)
  const [applying, setApplying] = useState(false)

  const handleApply = async () => {
    setApplying(true)
    try {
      await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: job.id, resume_id: selectedResume }),
      })
    } catch {
      // demo mode
    }
    setApplied(true)
    setApplying(false)
  }

  const daysAgo = Math.floor((Date.now() - new Date(job.posted_at).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                      <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium capitalize">
                        {job.job_type.replace("-", " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </span>
                      <span>Posted {daysAgo === 0 ? "today" : `${daysAgo}d ago`}</span>
                    </div>
                  </div>
                </div>

                {job.salary_range && job.salary_range.min > 100 && (
                  <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 mb-6">
                    <div className="text-xs text-muted-foreground mb-1">Salary Range</div>
                    <div className="text-xl font-bold text-accent">
                      ${job.salary_range.min.toLocaleString()} - ${job.salary_range.max.toLocaleString()}
                      <span className="text-sm font-normal text-muted-foreground ml-1">/year</span>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-semibold text-foreground mb-3">About the Role</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{job.description}</p>
                  </div>

                  {job.requirements && (
                    <div>
                      <h2 className="text-sm font-semibold text-foreground mb-3">Requirements</h2>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.split(",").map((req, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-1.5 rounded-lg bg-muted/50 text-foreground border border-border/50">
                            {req.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Apply Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border border-border/50 sticky top-20">
              <CardContent className="p-6">
                {applied ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">Application Submitted!</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Track your application in the Applications page.
                    </p>
                    <Link href="/applications">
                      <Button variant="outline" className="w-full">View Applications</Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-foreground mb-4">Apply for this role</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Select Resume</label>
                        <select
                          value={selectedResume}
                          onChange={(e) => setSelectedResume(e.target.value)}
                          className="w-full mt-1.5 h-9 px-3 rounded-lg border border-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                        >
                          {resumes.map((r) => (
                            <option key={r.id} value={r.id}>{r.title}</option>
                          ))}
                        </select>
                      </div>

                      <Button
                        className="w-full bg-accent hover:bg-accent/90 text-white"
                        onClick={handleApply}
                        disabled={applying || !selectedResume}
                      >
                        {applying ? "Submitting..." : "Submit Application"}
                      </Button>

                      <p className="text-[11px] text-muted-foreground text-center">
                        Your resume and profile will be shared with the employer
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
