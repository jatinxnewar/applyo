"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ApplicantDetail } from "./applicant-detail"
import type { Application } from "@/lib/types"

interface ApplicantsListProps {
  applications: (Application & { user?: any; resume?: any })[]
  tracking: any[]
  jobId: string
}

export function ApplicantsList({ applications, tracking, jobId }: ApplicantsListProps) {
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const statuses = ["submitted", "reviewed", "shortlisted", "rejected", "accepted"]

  const filteredApplications =
    filterStatus === "all" ? applications : applications.filter((app) => app.status === filterStatus)

  const selectedApplication = applications.find((app) => app.id === selectedApplicantId)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Applications List */}
      <div className="lg:col-span-2">
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              All ({applications.length})
            </Button>
            {statuses.map((status) => {
              const count = applications.filter((a) => a.status === status).length
              return (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                </Button>
              )
            })}
          </div>

          {/* Application Cards */}
          <div className="space-y-3">
            {filteredApplications.length === 0 ? (
              <Card className="border border-dashed border-border/50 bg-card/50">
                <CardContent className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">No applicants with this status</p>
                </CardContent>
              </Card>
            ) : (
              filteredApplications.map((application) => (
                <Card
                  key={application.id}
                  className={`border transition-all cursor-pointer ${
                    selectedApplicantId === application.id
                      ? "border-accent bg-card"
                      : "border-border/50 hover:border-accent/30"
                  }`}
                  onClick={() => setSelectedApplicantId(application.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {application.user?.full_name || "Anonymous"}
                          </h3>
                          <Badge
                            variant="outline"
                            className={
                              application.status === "accepted"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : application.status === "rejected"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                            }
                          >
                            {application.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{application.user?.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Applied {new Date(application.applied_at).toLocaleDateString()}
                        </p>
                      </div>
                      {application.ats_match_score && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-accent">
                            {Math.round(application.ats_match_score)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Match Score</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Applicant Details Panel */}
      <div className="lg:col-span-1">
        {selectedApplication ? (
          <ApplicantDetail
            application={selectedApplication}
            jobId={jobId}
            tracking={tracking?.filter((t) => t.application_id === selectedApplication.id) || []}
          />
        ) : (
          <Card className="border border-dashed border-border/50 bg-card/50">
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground text-center">Select an applicant to view details</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
