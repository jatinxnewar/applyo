"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"

interface Template {
  id: string
  name: string
  description: string
  preview: string
}

interface TemplateGridProps {
  templates: Template[]
}

export function TemplateGrid({ templates }: TemplateGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resumeId = searchParams.get("resumeId")

  const handleSelectTemplate = (templateId: string) => {
    const params = resumeId ? `?resumeId=${resumeId}&template=${templateId}` : `?template=${templateId}`
    router.push(`/resume/builder${params}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {templates.map((template) => (
        <Card
          key={template.id}
          className="border border-border/50 hover:border-accent/30 hover:shadow-lg transition-all overflow-hidden"
        >
          <CardContent className="p-0">
            <div className="aspect-[3/4] bg-muted/50 overflow-hidden flex items-center justify-center">
              <img
                src={template.preview || "/placeholder.svg"}
                alt={template.name}
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
          <CardHeader className="space-y-3">
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{template.description}</p>
            <Button onClick={() => handleSelectTemplate(template.id)} className="w-full bg-accent hover:bg-accent/90">
              Use Template
            </Button>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
