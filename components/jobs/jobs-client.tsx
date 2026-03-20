"use client"

import { useState } from "react"
import { Navbar } from "@/components/shared/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import type { JobPosting } from "@/lib/types"

interface JobsClientProps {
  jobs: JobPosting[]
}

const jobTypes = ["all", "full-time", "part-time", "contract", "internship"]

export function JobsClient({ jobs }: JobsClientProps) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filtered = jobs.filter((job) => {
    const matchesSearch =
      search === "" ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === "all" || job.job_type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Search hero */}
      <div className="border-b border-border/40 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">Find Your Next Role</h1>
          <p className="text-muted-foreground text-sm mb-5">Browse {jobs.length} open positions</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, location, or keyword..."
                className="pl-10 h-10"
              />
            </div>
          </div>
          {/* Type filter pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {jobTypes.map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  typeFilter === type
                    ? "bg-accent text-white"
                    : "bg-background border border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((job) => {
              const daysAgo = Math.floor(
                (Date.now() - new Date(job.posted_at).getTime()) / (1000 * 60 * 60 * 24)
              )
              const timeLabel = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`

              return (
                <Card key={job.id} className="border border-border/50 hover:border-accent/30 hover:shadow-sm transition-all duration-200">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                          <Link href={`/jobs/${job.id}`} className="hover:underline">
                            <h3 className="font-semibold text-foreground">{job.title}</h3>
                          </Link>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium capitalize">
                            {job.job_type.replace("-", " ")}
                          </span>
                          <span className="text-xs text-muted-foreground ml-auto hidden sm:block">{timeLabel}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {job.description.substring(0, 200)}...
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                          </span>
                          {job.salary_range && job.salary_range.min > 100 && (
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              ${job.salary_range.min.toLocaleString()} - ${job.salary_range.max.toLocaleString()}
                            </span>
                          )}
                          {job.requirements && (
                            <span className="hidden md:flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              {job.requirements.split(",").length} requirements
                            </span>
                          )}
                        </div>
                      </div>
                      <Link href={`/jobs/${job.id}`} className="shrink-0">
                        <Button size="sm" className="bg-accent hover:bg-accent/90 text-white">
                          View & Apply
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="border border-dashed border-border/50 bg-card/30">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-1">No matching jobs found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
