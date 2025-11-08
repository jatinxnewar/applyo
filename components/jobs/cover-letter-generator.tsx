"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type { JobPosting, Resume } from "@/lib/types"

interface CoverLetterGeneratorProps {
  job: JobPosting
  resume: Resume
}

export function CoverLetterGenerator({ job, resume }: CoverLetterGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: job.id,
          resume_id: resume.id,
          company_name: "Company",
          position: job.title,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setCoverLetter(data.cover_letter)
        setShowPreview(true)
      }
    } catch (error) {
      console.error("Generation failed:", error)
      alert("Failed to generate cover letter")
    } finally {
      setIsGenerating(false)
    }
  }

  if (!showPreview) {
    return (
      <Button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-accent hover:bg-accent/90">
        {isGenerating ? "Generating..." : "Generate Cover Letter"}
      </Button>
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter)
    alert("Cover letter copied to clipboard!")
  }

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>AI-Generated Cover Letter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          className="w-full h-64 text-sm"
          placeholder="Your cover letter will appear here..."
        />
        <div className="flex gap-2">
          <Button onClick={handleCopy} variant="outline" className="flex-1 bg-transparent">
            Copy
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating} variant="outline" className="flex-1 bg-transparent">
            Regenerate
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
