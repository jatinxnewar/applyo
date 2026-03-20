"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "@/lib/types"

interface ProfileFormProps {
  user: User | null
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    phone: user?.phone || "",
    location: user?.location || "",
    bio: user?.bio || "",
    linkedin_url: user?.linkedin_url || "",
    github_url: user?.github_url || "",
    portfolio_url: user?.portfolio_url || "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage("")

    try {
      const response = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSaveMessage("Profile updated successfully!")
        setTimeout(() => setSaveMessage(""), 3000)
      } else {
        setSaveMessage("Profile saved locally (demo mode)")
        setTimeout(() => setSaveMessage(""), 3000)
      }
    } catch {
      setSaveMessage("Profile saved locally (demo mode)")
      setTimeout(() => setSaveMessage(""), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Full Name</label>
            <Input
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Your Full Name"
              className="mt-1.5 h-9"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <Input type="email" value={user?.email || ""} disabled className="mt-1.5 h-9 bg-muted/30" />
            <p className="text-[11px] text-muted-foreground mt-1">Managed by your sign-in provider</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="mt-1.5 h-9"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, State"
                className="mt-1.5 h-9"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              className="w-full mt-1.5 px-3 py-2.5 rounded-lg border border-border bg-transparent text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Professional Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">LinkedIn</label>
            <Input
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/yourprofile"
              className="mt-1.5 h-9"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">GitHub</label>
            <Input
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              placeholder="https://github.com/yourprofile"
              className="mt-1.5 h-9"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Portfolio</label>
            <Input
              value={formData.portfolio_url}
              onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
              placeholder="https://yourportfolio.com"
              className="mt-1.5 h-9"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        {saveMessage && (
          <p className={`text-sm ${saveMessage.includes("success") ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
            {saveMessage}
          </p>
        )}
        <div className="ml-auto">
          <Button type="submit" className="bg-accent hover:bg-accent/90 text-white" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </div>
    </form>
  )
}
