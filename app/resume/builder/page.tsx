"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ResumePreview } from "@/components/resume/resume-preview"
import { ResumeEditorTabs } from "@/components/resume/resume-editor-tabs"
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

  useEffect(() => {
    // Load user profile data into personal section
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
      } catch (error) {
        console.error("Failed to load profile:", error)
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
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Failed to save resume:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              ←
            </Button>
            <Input
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              className="max-w-xs font-bold text-lg bg-transparent border-none focus-visible:ring-0 px-0"
              placeholder="Resume Title"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/resume/templates")}>
              Change Template
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={handleSaveResume} disabled={saving}>
              {saving ? "Saving..." : "Save Resume"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            <Card className="border border-border/50 bg-white dark:bg-slate-900">
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
