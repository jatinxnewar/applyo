import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TemplateGrid } from "@/components/resume/template-grid"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const AVAILABLE_TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean, contemporary design with focus on readability",
    preview: "/modern-resume-template.png",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Professional traditional format perfect for corporate roles",
    preview: "/classic-resume-template.png",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Sleek and simple with essential information highlighted",
    preview: "/minimalist-resume-template.png",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Eye-catching design for creative and design roles",
    preview: "/creative-resume-template.png",
  },
]

export default async function TemplatesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-bold text-foreground">Applyo</span>
          </Link>
          <Button variant="outline" asChild>
            <Link href="/resume/builder">Back to Builder</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Resume Templates</h1>
            <p className="text-muted-foreground">Choose a template that best represents your professional style</p>
          </div>

          <TemplateGrid templates={AVAILABLE_TEMPLATES} />
        </div>
      </main>
    </div>
  )
}
