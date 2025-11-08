"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { calculateJDRequirements } from "@/lib/ats-scorer"
import type { JobPosting } from "@/lib/types"

interface JobDetailsEnhancedProps {
  job: JobPosting
}

export function JobDetailsEnhanced({ job }: JobDetailsEnhancedProps) {
  const requirements = calculateJDRequirements(job.description)

  return (
    <div className="space-y-6">
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle>Job Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {requirements.minExperience > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Experience Required</h4>
              <p className="text-sm text-muted-foreground">{requirements.minExperience}+ years</p>
            </div>
          )}

          {requirements.requiredSkills.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {requirements.requiredSkills.map((skill) => (
                  <Badge key={skill} className="bg-accent/10 text-accent">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {requirements.requirements.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Key Requirements</h4>
              <ul className="text-sm space-y-2">
                {requirements.requirements.map((req, idx) => (
                  <li key={idx} className="flex gap-2 text-muted-foreground">
                    <span className="text-accent flex-shrink-0">▪</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
