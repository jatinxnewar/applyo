"use client"
import { AdminStats } from "./admin-stats"
import { AdminUserManagement } from "./admin-user-management"
import { AdminJobModeration } from "./admin-job-moderation"

interface AdminDashboardProps {
  stats: {
    totalUsers: number
    totalJobs: number
    totalApplications: number
    totalResumes: number
  }
}

export function AdminDashboard({ stats }: AdminDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Statistics */}
      <AdminStats stats={stats} />

      {/* Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AdminUserManagement />
        <AdminJobModeration />
      </div>
    </div>
  )
}
