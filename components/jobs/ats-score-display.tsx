"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { ATSScore } from "@/lib/ats-scorer"

interface ATSScoreDisplayProps {
  jobId: string
  resumeId: string
}

export function ATSScoreDisplay({ jobId, resumeId }: ATSScoreDisplayProps) {
  const [score, setScore] = useState<ATSScore | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCalculateScore = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/score-resume-job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_id: resumeId,
          job_id: jobId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setScore(data)
      }
    } catch (error) {
      console.error("Failed to calculate score:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!score) {
    return (
      <Button onClick={handleCalculateScore} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
        {isLoading ? "Calculating..." : "Check ATS Match Score"}
      </Button>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>ATS Match Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Overall Match</span>
            <span className={`text-2xl font-bold ${getScoreColor(score.overallScore)}`}>{score.overallScore}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${getScoreBarColor(score.overallScore)} transition-all`}
              style={{ width: `${score.overallScore}%` }}
            />
          </div>
        </div>

        {/* Category Scores */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium">Skills Match</span>
              <span>{score.skillsMatch}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-accent" style={{ width: `${score.skillsMatch}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium">Keywords Match</span>
              <span>{score.keywordsMatch}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-accent" style={{ width: `${score.keywordsMatch}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium">Experience Match</span>
              <span>{score.experienceMatch}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-accent" style={{ width: `${score.experienceMatch}%` }} />
            </div>
          </div>
        </div>

        {/* Matched Skills */}
        {score.details.matchedSkills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Matched Skills</h4>
            <div className="flex flex-wrap gap-2">
              {score.details.matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {score.details.missingSkills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Missing Skills</h4>
            <div className="flex flex-wrap gap-2">
              {score.details.missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded"
                >
                  ✗ {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {score.details.suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Improvement Tips</h4>
            <ul className="text-sm space-y-1">
              {score.details.suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex gap-2 text-muted-foreground">
                  <span className="text-accent">→</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button onClick={handleCalculateScore} variant="outline" className="w-full bg-transparent">
          Recalculate
        </Button>
      </CardContent>
    </Card>
  )
}
