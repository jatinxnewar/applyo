"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import type { ResumeContent } from "@/lib/types"

interface ResumeEditorTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  content: ResumeContent
  setContent: (content: ResumeContent) => void
}

export function ResumeEditorTabs({ activeTab, setActiveTab, content, setContent }: ResumeEditorTabsProps) {
  const tabs = ["personal", "summary", "experience", "education", "skills", "certifications"]

  const addExperience = () => {
    setContent({
      ...content,
      experience: [...content.experience, { company: "", position: "", duration: "", description: "" }],
    })
  }

  const addEducation = () => {
    setContent({
      ...content,
      education: [...content.education, { school: "", degree: "", field: "", year: "" }],
    })
  }

  const addSkill = () => {
    setContent({
      ...content,
      skills: [...content.skills, ""],
    })
  }

  return (
    <>
      <div className="flex gap-2 border-b border-border/50 pb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === tab ? "text-accent border-b-2 border-accent" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <Card className="border border-border/50">
        <CardContent className="p-6 space-y-4">
          {activeTab === "personal" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={content.personal.full_name}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        personal: { ...content.personal, full_name: e.target.value },
                      })
                    }
                    placeholder="Your Full Name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={content.personal.email}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        personal: { ...content.personal, email: e.target.value },
                      })
                    }
                    type="email"
                    placeholder="your@email.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={content.personal.phone || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        personal: { ...content.personal, phone: e.target.value },
                      })
                    }
                    placeholder="+1 (555) 123-4567"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={content.personal.location || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        personal: { ...content.personal, location: e.target.value },
                      })
                    }
                    placeholder="City, State"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "summary" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Professional Summary</h3>
              <textarea
                value={content.summary || ""}
                onChange={(e) => setContent({ ...content, summary: e.target.value })}
                placeholder="Write a brief professional summary..."
                className="w-full px-3 py-2 rounded-lg border border-border/50 bg-input text-sm resize-none h-32"
              />
            </div>
          )}

          {activeTab === "experience" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Work Experience</h3>
                <Button size="sm" variant="outline" onClick={addExperience}>
                  + Add Experience
                </Button>
              </div>
              <div className="space-y-4">
                {content.experience.map((exp, idx) => (
                  <Card key={idx} className="border border-border/50 bg-card/50">
                    <CardContent className="p-4 space-y-3">
                      <Input
                        value={exp.company}
                        onChange={(e) => {
                          const newExp = [...content.experience]
                          newExp[idx].company = e.target.value
                          setContent({ ...content, experience: newExp })
                        }}
                        placeholder="Company"
                      />
                      <Input
                        value={exp.position}
                        onChange={(e) => {
                          const newExp = [...content.experience]
                          newExp[idx].position = e.target.value
                          setContent({ ...content, experience: newExp })
                        }}
                        placeholder="Position"
                      />
                      <Input
                        value={exp.duration}
                        onChange={(e) => {
                          const newExp = [...content.experience]
                          newExp[idx].duration = e.target.value
                          setContent({ ...content, experience: newExp })
                        }}
                        placeholder="Duration (e.g., Jan 2020 - Present)"
                      />
                      <textarea
                        value={exp.description}
                        onChange={(e) => {
                          const newExp = [...content.experience]
                          newExp[idx].description = e.target.value
                          setContent({ ...content, experience: newExp })
                        }}
                        placeholder="Job description"
                        className="w-full px-3 py-2 rounded-lg border border-border/50 bg-input text-sm resize-none h-20"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          const newExp = content.experience.filter((_, i) => i !== idx)
                          setContent({ ...content, experience: newExp })
                        }}
                      >
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "education" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Education</h3>
                <Button size="sm" variant="outline" onClick={addEducation}>
                  + Add Education
                </Button>
              </div>
              <div className="space-y-4">
                {content.education.map((edu, idx) => (
                  <Card key={idx} className="border border-border/50 bg-card/50">
                    <CardContent className="p-4 space-y-3">
                      <Input
                        value={edu.school}
                        onChange={(e) => {
                          const newEdu = [...content.education]
                          newEdu[idx].school = e.target.value
                          setContent({ ...content, education: newEdu })
                        }}
                        placeholder="School/University"
                      />
                      <Input
                        value={edu.degree}
                        onChange={(e) => {
                          const newEdu = [...content.education]
                          newEdu[idx].degree = e.target.value
                          setContent({ ...content, education: newEdu })
                        }}
                        placeholder="Degree"
                      />
                      <Input
                        value={edu.field}
                        onChange={(e) => {
                          const newEdu = [...content.education]
                          newEdu[idx].field = e.target.value
                          setContent({ ...content, education: newEdu })
                        }}
                        placeholder="Field of Study"
                      />
                      <Input
                        value={edu.year}
                        onChange={(e) => {
                          const newEdu = [...content.education]
                          newEdu[idx].year = e.target.value
                          setContent({ ...content, education: newEdu })
                        }}
                        placeholder="Graduation Year"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          const newEdu = content.education.filter((_, i) => i !== idx)
                          setContent({ ...content, education: newEdu })
                        }}
                      >
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Skills</h3>
                <Button size="sm" variant="outline" onClick={addSkill}>
                  + Add Skill
                </Button>
              </div>
              <div className="space-y-2">
                {content.skills.map((skill, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={skill}
                      onChange={(e) => {
                        const newSkills = [...content.skills]
                        newSkills[idx] = e.target.value
                        setContent({ ...content, skills: newSkills })
                      }}
                      placeholder="e.g., React, Python, Project Management"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const newSkills = content.skills.filter((_, i) => i !== idx)
                        setContent({ ...content, skills: newSkills })
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "certifications" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Certifications & Awards</h3>
              <p className="text-sm text-muted-foreground">Add your professional certifications and awards</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
