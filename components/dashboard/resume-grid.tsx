"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Resume } from "@/lib/types"

interface ResumeGridProps {
  resumes: Resume[]
}

const templateColors: Record<string, string> = {
  modern: "from-accent to-blue-600",
  classic: "from-slate-600 to-slate-800",
  minimalist: "from-gray-500 to-gray-700",
  creative: "from-purple-500 to-pink-500",
}

export function ResumeGrid({ resumes }: ResumeGridProps) {
  if (resumes.length === 0) {
    return (
      <Card className="border border-dashed border-border/50 bg-card/30">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-foreground mb-1">No resumes yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Create your first resume to get started</p>
          <Link href="/resume/builder">
            <Button className="bg-accent hover:bg-accent/90 text-white">Create Your First Resume</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {resumes.map((resume) => {
        const templateGradient = templateColors[resume.template_id || "modern"] || templateColors.modern
        return (
          <Card key={resume.id} className="border border-border/50 hover:border-accent/30 hover:shadow-md transition-all duration-200 group overflow-hidden">
            {/* Template color strip */}
            <div className={`h-1.5 bg-linear-to-r ${templateGradient}`} />
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${templateGradient} flex items-center justify-center text-white`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm leading-tight">{resume.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">{resume.template_id || "modern"} template</p>
                  </div>
                </div>
                {resume.ats_score != null && (
                  <div className={`text-right px-2.5 py-1 rounded-lg ${
                    resume.ats_score >= 80
                      ? "bg-green-500/10 text-green-600"
                      : resume.ats_score >= 60
                        ? "bg-yellow-500/10 text-yellow-600"
                        : "bg-red-500/10 text-red-600"
                  }`}>
                    <div className="text-lg font-bold leading-none">{Math.round(resume.ats_score)}</div>
                    <div className="text-[10px] mt-0.5">ATS</div>
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground mb-4">
                Updated {new Date(resume.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>

              <div className="flex gap-2">
                <Link href={`/resume/builder?id=${resume.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="text-xs">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
