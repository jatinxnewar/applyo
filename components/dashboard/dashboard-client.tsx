"use client"

import { Navbar } from "@/components/shared/navbar"
import { ResumeGrid } from "@/components/dashboard/resume-grid"
import { JobBoard } from "@/components/dashboard/job-board"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { User, Resume, JobPosting } from "@/lib/types"

interface DashboardClientProps {
  user: User
  resumes: Resume[]
  jobs: JobPosting[]
}

export function DashboardClient({ user, resumes, jobs }: DashboardClientProps) {
  const totalApplications = 4
  const avgAtsScore = resumes.length > 0
    ? Math.round(resumes.reduce((sum, r) => sum + (r.ats_score || 0), 0) / resumes.length)
    : 0

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user.full_name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-muted-foreground mt-1">Here&apos;s an overview of your job search progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Card className="border border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{resumes.length}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Resumes</div>
            </CardContent>
          </Card>

          <Card className="border border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{totalApplications}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Applications</div>
            </CardContent>
          </Card>

          <Card className="border border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{avgAtsScore}%</div>
              <div className="text-xs text-muted-foreground mt-0.5">Avg ATS Score</div>
            </CardContent>
          </Card>

          <Card className="border border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{jobs.length}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Jobs Available</div>
            </CardContent>
          </Card>
        </div>

        {/* Resumes Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-foreground">Your Resumes</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Create and manage your professional resumes</p>
            </div>
            <Link href="/resume/builder">
              <Button className="bg-accent hover:bg-accent/90 text-white">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Resume
              </Button>
            </Link>
          </div>
          <ResumeGrid resumes={resumes} />
        </section>

        {/* Job Board Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-foreground">Recommended Jobs</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Opportunities matched to your profile</p>
            </div>
            <Link href="/jobs">
              <Button variant="outline">View All Jobs</Button>
            </Link>
          </div>
          <JobBoard jobs={jobs} />
        </section>
      </main>
    </div>
  )
}
