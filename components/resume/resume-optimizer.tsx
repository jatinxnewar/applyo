"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Resume } from "@/lib/types"

interface ResumeOptimizerProps {
  resume: Resume
  jobDescription?: string
}

interface OptimizationAnalysis {
  overall_score: number
  improvements: Array<{
    section: string
    issue: string
    suggestion: string
    priority: "high" | "medium" | "low"
  }>
  keywords_to_add?: string[]
  rewritten_summary?: string
  ats_tips?: string[]
}

export function ResumeOptimizer({ resume, jobDescription }: ResumeOptimizerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<OptimizationAnalysis | null>(null)

  const handleOptimize = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/ai/optimize-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_id: resume.id,
          job_description: jobDescription || "General optimization for any job position",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setAnalysis(data)
      }
    } catch (error) {
      console.error("Optimization failed:", error)
      alert("Failed to optimize resume")
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (!analysis) {
    return (
      <Button onClick={handleOptimize} disabled={isAnalyzing} className="bg-accent hover:bg-accent/90 w-full">
        {isAnalyzing ? "Analyzing..." : "Optimize with AI"}
      </Button>
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle>AI Optimization Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Score */}
          <div className="bg-linear-to-r from-accent/10 to-accent/5 p-4 rounded-lg border border-accent/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent">{analysis.overall_score}</div>
              <p className="text-sm text-muted-foreground mt-1">Overall Optimization Score</p>
            </div>
          </div>

          {/* Improvements */}
          {analysis.improvements && analysis.improvements.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Recommendations</h3>
              {analysis.improvements.map((improvement, idx) => (
                <Card key={idx} className="border border-border/50 bg-card/50">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-foreground">
                          {improvement.section.toUpperCase()} · {improvement.issue}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{improvement.suggestion}</p>
                      </div>
                      <Badge className={getPriorityColor(improvement.priority)}>{improvement.priority}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Keywords to Add */}
          {analysis.keywords_to_add && analysis.keywords_to_add.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Keywords to Add</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords_to_add.map((keyword, idx) => (
                  <Badge key={idx} className="bg-accent/10 text-accent">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Rewritten Summary */}
          {analysis.rewritten_summary && (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Improved Professional Summary</h3>
              <p className="text-sm text-foreground/80 bg-card/50 p-3 rounded-lg border border-border/50">
                {analysis.rewritten_summary}
              </p>
            </div>
          )}

          {/* ATS Tips */}
          {analysis.ats_tips && analysis.ats_tips.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">ATS Tips</h3>
              <ul className="text-sm space-y-2">
                {analysis.ats_tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span className="text-foreground/80">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button onClick={handleOptimize} variant="outline" className="w-full bg-transparent">
            Re-analyze
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
