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

const tabConfig = [
  { id: "personal", label: "Personal", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { id: "summary", label: "Summary", icon: "M4 6h16M4 12h16M4 18h7" },
  { id: "experience", label: "Experience", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { id: "education", label: "Education", icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" },
  { id: "skills", label: "Skills", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  { id: "certifications", label: "Certs", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
]

export function ResumeEditorTabs({ activeTab, setActiveTab, content, setContent }: ResumeEditorTabsProps) {
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
    setContent({ ...content, skills: [...content.skills, ""] })
  }

  const addCertification = () => {
    setContent({
      ...content,
      certifications: [...(content.certifications || []), { name: "", issuer: "", date: "" }],
    })
  }

  return (
    <>
      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-muted/50 rounded-xl overflow-x-auto">
        {tabConfig.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <Card className="border border-border/50">
        <CardContent className="p-5 space-y-4">
          {activeTab === "personal" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground text-sm">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                  <Input
                    value={content.personal.full_name}
                    onChange={(e) =>
                      setContent({ ...content, personal: { ...content.personal, full_name: e.target.value } })
                    }
                    placeholder="John Doe"
                    className="mt-1.5 h-9"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Email</label>
                  <Input
                    value={content.personal.email}
                    onChange={(e) =>
                      setContent({ ...content, personal: { ...content.personal, email: e.target.value } })
                    }
                    type="email"
                    placeholder="john@email.com"
                    className="mt-1.5 h-9"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Phone</label>
                  <Input
                    value={content.personal.phone || ""}
                    onChange={(e) =>
                      setContent({ ...content, personal: { ...content.personal, phone: e.target.value } })
                    }
                    placeholder="+1 (555) 123-4567"
                    className="mt-1.5 h-9"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">Location</label>
                  <Input
                    value={content.personal.location || ""}
                    onChange={(e) =>
                      setContent({ ...content, personal: { ...content.personal, location: e.target.value } })
                    }
                    placeholder="San Francisco, CA"
                    className="mt-1.5 h-9"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "summary" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground text-sm">Professional Summary</h3>
              <textarea
                value={content.summary || ""}
                onChange={(e) => setContent({ ...content, summary: e.target.value })}
                placeholder="Write a brief professional summary highlighting your key strengths and career goals..."
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-transparent text-sm resize-none h-36 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              />
              <p className="text-xs text-muted-foreground">Tip: Keep it 2-4 sentences. Focus on your value proposition.</p>
            </div>
          )}

          {activeTab === "experience" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground text-sm">Work Experience</h3>
                <Button size="sm" variant="outline" onClick={addExperience} className="text-xs h-8">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </Button>
              </div>
              {content.experience.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  <p>No experience added yet.</p>
                  <p className="text-xs mt-1">Click &quot;Add&quot; to add your work experience.</p>
                </div>
              )}
              <div className="space-y-3">
                {content.experience.map((exp, idx) => (
                  <Card key={idx} className="border border-border/50 bg-muted/20">
                    <CardContent className="p-4 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          value={exp.position}
                          onChange={(e) => {
                            const newExp = [...content.experience]
                            newExp[idx] = { ...newExp[idx], position: e.target.value }
                            setContent({ ...content, experience: newExp })
                          }}
                          placeholder="Job Title"
                          className="h-9"
                        />
                        <Input
                          value={exp.company}
                          onChange={(e) => {
                            const newExp = [...content.experience]
                            newExp[idx] = { ...newExp[idx], company: e.target.value }
                            setContent({ ...content, experience: newExp })
                          }}
                          placeholder="Company"
                          className="h-9"
                        />
                      </div>
                      <Input
                        value={exp.duration}
                        onChange={(e) => {
                          const newExp = [...content.experience]
                          newExp[idx] = { ...newExp[idx], duration: e.target.value }
                          setContent({ ...content, experience: newExp })
                        }}
                        placeholder="Jan 2020 - Present"
                        className="h-9"
                      />
                      <textarea
                        value={exp.description}
                        onChange={(e) => {
                          const newExp = [...content.experience]
                          newExp[idx] = { ...newExp[idx], description: e.target.value }
                          setContent({ ...content, experience: newExp })
                        }}
                        placeholder="Describe your key responsibilities and achievements..."
                        className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 h-7"
                          onClick={() => {
                            setContent({ ...content, experience: content.experience.filter((_, i) => i !== idx) })
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "education" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground text-sm">Education</h3>
                <Button size="sm" variant="outline" onClick={addEducation} className="text-xs h-8">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </Button>
              </div>
              {content.education.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  <p>No education added yet.</p>
                  <p className="text-xs mt-1">Click &quot;Add&quot; to add your education history.</p>
                </div>
              )}
              <div className="space-y-3">
                {content.education.map((edu, idx) => (
                  <Card key={idx} className="border border-border/50 bg-muted/20">
                    <CardContent className="p-4 space-y-3">
                      <Input
                        value={edu.school}
                        onChange={(e) => {
                          const newEdu = [...content.education]
                          newEdu[idx] = { ...newEdu[idx], school: e.target.value }
                          setContent({ ...content, education: newEdu })
                        }}
                        placeholder="University / School"
                        className="h-9"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          value={edu.degree}
                          onChange={(e) => {
                            const newEdu = [...content.education]
                            newEdu[idx] = { ...newEdu[idx], degree: e.target.value }
                            setContent({ ...content, education: newEdu })
                          }}
                          placeholder="Degree (e.g., B.S.)"
                          className="h-9"
                        />
                        <Input
                          value={edu.field}
                          onChange={(e) => {
                            const newEdu = [...content.education]
                            newEdu[idx] = { ...newEdu[idx], field: e.target.value }
                            setContent({ ...content, education: newEdu })
                          }}
                          placeholder="Field of Study"
                          className="h-9"
                        />
                      </div>
                      <Input
                        value={edu.year}
                        onChange={(e) => {
                          const newEdu = [...content.education]
                          newEdu[idx] = { ...newEdu[idx], year: e.target.value }
                          setContent({ ...content, education: newEdu })
                        }}
                        placeholder="Graduation Year"
                        className="h-9"
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 h-7"
                          onClick={() => {
                            setContent({ ...content, education: content.education.filter((_, i) => i !== idx) })
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground text-sm">Skills</h3>
                <Button size="sm" variant="outline" onClick={addSkill} className="text-xs h-8">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Skill
                </Button>
              </div>
              {content.skills.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  <p>No skills added yet.</p>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {content.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-muted/50 rounded-lg pl-3 pr-1 py-1">
                    <input
                      value={skill}
                      onChange={(e) => {
                        const newSkills = [...content.skills]
                        newSkills[idx] = e.target.value
                        setContent({ ...content, skills: newSkills })
                      }}
                      placeholder="Skill name"
                      className="bg-transparent border-none outline-none text-sm w-24 min-w-0"
                    />
                    <button
                      onClick={() => setContent({ ...content, skills: content.skills.filter((_, i) => i !== idx) })}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "certifications" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground text-sm">Certifications & Awards</h3>
                <Button size="sm" variant="outline" onClick={addCertification} className="text-xs h-8">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </Button>
              </div>
              {(!content.certifications || content.certifications.length === 0) && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  <p>No certifications added yet.</p>
                </div>
              )}
              <div className="space-y-3">
                {(content.certifications || []).map((cert, idx) => (
                  <Card key={idx} className="border border-border/50 bg-muted/20">
                    <CardContent className="p-4 space-y-3">
                      <Input
                        value={cert.name}
                        onChange={(e) => {
                          const certs = [...(content.certifications || [])]
                          certs[idx] = { ...certs[idx], name: e.target.value }
                          setContent({ ...content, certifications: certs })
                        }}
                        placeholder="Certification Name"
                        className="h-9"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          value={cert.issuer}
                          onChange={(e) => {
                            const certs = [...(content.certifications || [])]
                            certs[idx] = { ...certs[idx], issuer: e.target.value }
                            setContent({ ...content, certifications: certs })
                          }}
                          placeholder="Issuing Organization"
                          className="h-9"
                        />
                        <Input
                          value={cert.date}
                          onChange={(e) => {
                            const certs = [...(content.certifications || [])]
                            certs[idx] = { ...certs[idx], date: e.target.value }
                            setContent({ ...content, certifications: certs })
                          }}
                          placeholder="Date (e.g., 2024)"
                          className="h-9"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 h-7"
                          onClick={() => {
                            setContent({
                              ...content,
                              certifications: (content.certifications || []).filter((_, i) => i !== idx),
                            })
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
