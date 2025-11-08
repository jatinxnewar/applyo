"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function AdminJobModeration() {
  const [jobs, setJobs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const response = await fetch("/api/admin/jobs")
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      }
    } catch (error) {
      console.error("Failed to load jobs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
      case "filled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Job Moderation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {jobs.slice(0, 8).map((job) => (
              <div
                key={job.id}
                className="flex items-start justify-between p-3 rounded-lg bg-card/50 border border-border/50"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">{job.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {job.location} • Posted {new Date(job.posted_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
              </div>
            ))}
          </div>
        )}

        <Button variant="outline" className="w-full text-sm bg-transparent">
          View All Jobs
        </Button>
      </CardContent>
    </Card>
  )
}
