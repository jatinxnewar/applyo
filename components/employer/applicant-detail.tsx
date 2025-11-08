"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Application } from "@/lib/types"

interface ApplicantDetailProps {
  application: Application & { user?: any; resume?: any }
  jobId: string
  tracking: any[]
}

export function ApplicantDetail({ application, jobId, tracking }: ApplicantDetailProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(application.status)

  const statusOptions = ["submitted", "reviewed", "shortlisted", "accepted", "rejected"]

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true)
    try {
      const response = await fetch(`/api/applications/${application.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setCurrentStatus(newStatus)
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  return (
    <div className="space-y-4 sticky top-24">
      {/* Header */}
      <Card className="border border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
              {application.user?.full_name?.charAt(0) || "A"}
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{application.user?.full_name || "Anonymous"}</h2>
              <p className="text-xs text-muted-foreground">{application.user?.email}</p>
            </div>
          </div>

          {application.user?.phone && <p className="text-sm text-muted-foreground mb-2">📱 {application.user.phone}</p>}
          {application.user?.location && (
            <p className="text-sm text-muted-foreground">📍 {application.user.location}</p>
          )}
        </CardContent>
      </Card>

      {/* Status Update */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Application Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <Button
                key={status}
                size="sm"
                variant={currentStatus === status ? "default" : "outline"}
                onClick={() => handleStatusChange(status)}
                disabled={isUpdatingStatus}
                className={
                  currentStatus === status && status === "accepted"
                    ? "bg-green-600 hover:bg-green-700"
                    : currentStatus === status && status === "rejected"
                      ? "bg-red-600 hover:bg-red-700"
                      : ""
                }
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Application Details */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Application Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Applied</p>
            <p className="text-foreground font-medium">
              {new Date(application.applied_at).toLocaleDateString()} at{" "}
              {new Date(application.applied_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {application.ats_match_score && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Match Score</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: `${application.ats_match_score}%` }} />
                </div>
                <span className="font-bold text-accent">{Math.round(application.ats_match_score)}%</span>
              </div>
            </div>
          )}

          {application.cover_letter && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Cover Letter</p>
              <p className="text-foreground/80 text-xs line-clamp-3">{application.cover_letter}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline */}
      {tracking && tracking.length > 0 && (
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {tracking.map((event) => (
                <div key={event.id} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-foreground font-medium">{event.event_type?.replace(/_/g, " ")}</p>
                    {event.notes && <p className="text-xs text-muted-foreground mt-1">{event.notes}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(event.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
