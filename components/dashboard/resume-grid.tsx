"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ResumeDownload } from "@/components/resume/resume-download"
import Link from "next/link"
import type { Resume } from "@/lib/types"

interface ResumeGridProps {
  resumes: Resume[]
}

export function ResumeGrid({ resumes }: ResumeGridProps) {
  if (resumes.length === 0) {
    return (
      <Card className="border border-dashed border-border/50 bg-card/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-foreground mb-1">No resumes yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Create your first resume to get started</p>
          <Link href="/resume/builder">
            <Button className="bg-accent hover:bg-accent/90">Create Your First Resume</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resumes.map((resume) => (
        <Card key={resume.id} className="border border-border/50 hover:border-accent/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              {resume.ats_score && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-accent">{Math.round(resume.ats_score)}</div>
                  <div className="text-xs text-muted-foreground">ATS Score</div>
                </div>
              )}
            </div>
            <h3 className="font-semibold text-foreground mb-1">{resume.title}</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Updated {new Date(resume.updated_at).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
              <Link href={`/resume/builder/${resume.id}`} className="flex-1">
                <Button variant="outline" className="w-full text-sm bg-transparent">
                  Edit
                </Button>
              </Link>
              <ResumeDownload resume={resume} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
