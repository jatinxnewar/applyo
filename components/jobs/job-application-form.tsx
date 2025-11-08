"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import type { Resume } from "@/lib/types"

interface JobApplicationFormProps {
  jobId: string
  resumes: Resume[]
}

export function JobApplicationForm({ jobId, resumes }: JobApplicationFormProps) {
  const router = useRouter()
  const [selectedResumeId, setSelectedResumeId] = useState<string>(resumes[0]?.id || "")
  const [coverLetter, setCoverLetter] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: jobId,
          resume_id: selectedResumeId,
          cover_letter: coverLetter,
        }),
      })

      if (response.ok) {
        alert("Application submitted successfully!")
        router.push("/applications")
      }
    } catch (error) {
      console.error("Failed to submit application:", error)
      alert("Failed to submit application")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (resumes.length === 0) {
    return (
      <Card className="border border-border/50 sticky top-24">
        <CardContent className="p-6 text-center space-y-4">
          <p className="text-sm text-muted-foreground">You need to create a resume before applying</p>
          <Link href="/resume/builder">
            <Button className="w-full bg-accent hover:bg-accent/90">Create Resume</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-border/50 sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg">Apply Now</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Resume</label>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border/50 bg-input text-sm"
            >
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Cover Letter (Optional)</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell us why you're interested in this role..."
              className="w-full px-3 py-2 rounded-lg border border-border/50 bg-input text-sm resize-none h-32"
            />
          </div>

          <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
