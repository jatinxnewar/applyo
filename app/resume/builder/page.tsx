"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ResumePreview } from "@/components/resume/resume-preview"
import { ResumeEditorTabs } from "@/components/resume/resume-editor-tabs"
import Link from "next/link"
import type { ResumeContent, TemplateType } from "@/lib/types"

export default function ResumeBuilderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [resumeTitle, setResumeTitle] = useState("My Resume")
  const [template, setTemplate] = useState<TemplateType>((searchParams.get("template") as TemplateType) || "modern")
  const [content, setContent] = useState<ResumeContent>({
    personal: {
      full_name: "",
      email: "",
      phone: "",
      location: "",
      links: [],
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    certifications: [],
  })
  const [activeTab, setActiveTab] = useState("personal")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const response = await fetch("/api/auth/profile")
        if (response.ok) {
          const profile = await response.json()
          setContent((prev) => ({
            ...prev,
            personal: {
              ...prev.personal,
              full_name: profile.full_name || "",
              email: profile.email || "",
              phone: profile.phone || "",
              location: profile.location || "",
            },
          }))
        }
      } catch {
        // Use empty defaults
      }
    }
    loadProfileData()
  }, [])

  const handleSaveResume = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: resumeTitle,
          content,
          template_id: template,
        }),
      })
      if (response.ok) {
        setSaved(true)
        setTimeout(() => router.push("/dashboard"), 1000)
      }
    } catch {
      // Handle error silently
    } finally {
      setSaving(false)
    }
  }

  const templates: { id: TemplateType; label: string }[] = [
    { id: "modern", label: "Modern" },
    { id: "classic", label: "Classic" },
    { id: "minimalist", label: "Minimal" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/dashboard" className="shrink-0">
              <Button variant="ghost" size="icon-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </Link>
            <Input
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              className="max-w-[200px] sm:max-w-xs font-semibold bg-transparent border-none focus-visible:ring-0 px-0 h-8 text-foreground"
              placeholder="Resume Title"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Template selector */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    template === t.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <Button
              className="bg-accent hover:bg-accent/90 text-white"
              size="sm"
              onClick={handleSaveResume}
              disabled={saving || saved}
            >
              {saved ? (
                <>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved
                </>
              ) : saving ? "Saving..." : "Save Resume"}
            </Button>
          </div>
        </div>
      </header>

      {/* Builder */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="space-y-4">
            <ResumeEditorTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              content={content}
              setContent={setContent}
            />
          </div>

          {/* Preview */}
          <div className="sticky top-20 max-h-[calc(100vh-100px)] overflow-auto">
            <Card className="border border-border/50 shadow-lg bg-white dark:bg-slate-900">
              <CardContent className="p-8">
                <ResumePreview content={content} template={template} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
