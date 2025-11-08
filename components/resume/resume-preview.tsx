"use client"

import type { ResumeContent, TemplateType } from "@/lib/types"

interface ResumePreviewProps {
  content: ResumeContent
  template?: TemplateType
}

export function ResumePreview({ content, template = "modern" }: ResumePreviewProps) {
  // Modern template
  if (template === "modern") {
    return (
      <div className="space-y-5 font-sans text-xs text-foreground">
        <div className="border-b-2 border-accent pb-3">
          <h1 className="text-2xl font-bold">{content.personal.full_name || "Your Name"}</h1>
          <div className="flex gap-3 text-xs text-foreground/70 mt-2">
            {content.personal.email && <span>{content.personal.email}</span>}
            {content.personal.phone && <span>•</span>}
            {content.personal.phone && <span>{content.personal.phone}</span>}
            {content.personal.location && <span>•</span>}
            {content.personal.location && <span>{content.personal.location}</span>}
          </div>
        </div>

        {content.summary && (
          <div>
            <h2 className="font-bold text-sm text-accent uppercase tracking-wider mb-2">Professional Summary</h2>
            <p className="text-xs leading-relaxed">{content.summary}</p>
          </div>
        )}

        {content.experience.length > 0 && (
          <div>
            <h2 className="font-bold text-sm text-accent uppercase tracking-wider mb-2">Experience</h2>
            <div className="space-y-3">
              {content.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-xs">{exp.position}</span>
                    <span className="text-xs text-foreground/60">{exp.duration}</span>
                  </div>
                  <div className="text-xs text-foreground/70 font-medium">{exp.company}</div>
                  <p className="text-xs mt-1 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {content.education.length > 0 && (
          <div>
            <h2 className="font-bold text-sm text-accent uppercase tracking-wider mb-2">Education</h2>
            <div className="space-y-2">
              {content.education.map((edu, idx) => (
                <div key={idx}>
                  <div className="flex justify-between">
                    <span className="font-semibold text-xs">
                      {edu.degree} in {edu.field}
                    </span>
                    <span className="text-xs text-foreground/60">{edu.year}</span>
                  </div>
                  <div className="text-xs text-foreground/70">{edu.school}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {content.skills.length > 0 && (
          <div>
            <h2 className="font-bold text-sm text-accent uppercase tracking-wider mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {content.skills.map((skill, idx) => (
                <span key={idx} className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Classic template
  if (template === "classic") {
    return (
      <div className="space-y-4 font-serif text-xs text-foreground">
        <div className="text-center border-b border-foreground/20 pb-3">
          <h1 className="text-2xl font-bold">{content.personal.full_name || "Your Name"}</h1>
          <div className="flex justify-center gap-2 text-xs text-foreground/60 mt-2">
            {content.personal.email && <span>{content.personal.email}</span>}
            {content.personal.phone && <span>•</span>}
            {content.personal.phone && <span>{content.personal.phone}</span>}
            {content.personal.location && <span>•</span>}
            {content.personal.location && <span>{content.personal.location}</span>}
          </div>
        </div>

        {content.summary && (
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wide mb-1">Professional Summary</h2>
            <p className="text-xs leading-relaxed">{content.summary}</p>
          </div>
        )}

        {content.experience.length > 0 && (
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wide mb-2">Experience</h2>
            <div className="space-y-2">
              {content.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between">
                    <span className="font-semibold text-xs">{exp.position}</span>
                    <span className="text-xs text-foreground/60">{exp.duration}</span>
                  </div>
                  <div className="text-xs text-foreground/70">{exp.company}</div>
                  <p className="text-xs mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {content.education.length > 0 && (
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wide mb-1">Education</h2>
            <div className="space-y-1">
              {content.education.map((edu, idx) => (
                <div key={idx}>
                  <div className="flex justify-between">
                    <span className="font-semibold text-xs">{edu.degree}</span>
                    <span className="text-xs text-foreground/60">{edu.year}</span>
                  </div>
                  <div className="text-xs text-foreground/70">{edu.school}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {content.skills.length > 0 && (
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wide mb-1">Skills</h2>
            <p className="text-xs">{content.skills.join(" • ")}</p>
          </div>
        )}
      </div>
    )
  }

  // Minimalist template
  return (
    <div className="space-y-4 text-xs text-foreground">
      <div>
        <h1 className="text-xl font-bold">{content.personal.full_name || "Your Name"}</h1>
        <div className="text-xs text-foreground/60 mt-1">
          {[content.personal.email, content.personal.phone, content.personal.location].filter(Boolean).join(" • ")}
        </div>
      </div>

      {content.summary && <p className="text-xs leading-relaxed">{content.summary}</p>}

      {content.experience.length > 0 && (
        <div>
          <h2 className="font-bold text-xs mb-2">EXPERIENCE</h2>
          <div className="space-y-2">
            {content.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="font-semibold text-xs">
                  {exp.position} – {exp.company}
                </div>
                <div className="text-xs text-foreground/60">{exp.duration}</div>
                <p className="text-xs mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {content.education.length > 0 && (
        <div>
          <h2 className="font-bold text-xs mb-2">EDUCATION</h2>
          <div className="space-y-1">
            {content.education.map((edu, idx) => (
              <div key={idx}>
                <div className="font-semibold text-xs">
                  {edu.degree}, {edu.school}
                </div>
                <div className="text-xs text-foreground/60">{edu.year}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {content.skills.length > 0 && (
        <div>
          <h2 className="font-bold text-xs mb-2">SKILLS</h2>
          <div className="text-xs flex flex-wrap gap-2">
            {content.skills.map((skill, idx) => (
              <span key={idx}>
                {skill}
                {idx < content.skills.length - 1 ? "," : ""}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
