"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Resume } from "@/lib/types"

interface ResumeDownloadProps {
  resume: Resume
}

export function ResumeDownload({ resume }: ResumeDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadLatex = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(`/api/resumes/${resume.id}/download`, {
        method: "POST",
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${resume.title}.tex`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Download failed:", error)
      alert("Failed to download resume")
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDownloadPdf = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(`/api/resumes/${resume.id}/generate-pdf`, {
        method: "POST",
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${resume.title}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("PDF download failed:", error)
      alert("Failed to download PDF")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={isDownloading}>
        {isDownloading ? "Downloading..." : "PDF"}
      </Button>
      <Button variant="outline" size="sm" onClick={handleDownloadLatex} disabled={isDownloading}>
        LaTeX
      </Button>
    </div>
  )
}
