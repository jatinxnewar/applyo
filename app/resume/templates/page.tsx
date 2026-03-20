import { Navbar } from "@/components/shared/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean, contemporary design with accent colors and clear section hierarchy",
    gradient: "from-accent to-blue-600",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Professional traditional format ideal for corporate and formal roles",
    gradient: "from-slate-600 to-slate-800",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Sleek and simple layout that lets your content speak for itself",
    gradient: "from-gray-500 to-gray-700",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Eye-catching design with bold typography for creative industry roles",
    gradient: "from-purple-500 to-pink-500",
  },
]

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">Resume Templates</h1>
          <p className="text-sm text-muted-foreground">Choose a template that represents your professional style</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEMPLATES.map((template) => (
            <Card key={template.id} className="border border-border/50 hover:border-accent/30 hover:shadow-md transition-all duration-200 group overflow-hidden">
              {/* Preview area */}
              <div className={`h-48 bg-linear-to-br ${template.gradient} flex items-center justify-center relative`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative bg-white rounded-lg shadow-xl w-24 h-32 p-2">
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-12 bg-gray-300 rounded" />
                    <div className="h-1 w-16 bg-gray-200 rounded" />
                    <div className="h-0.5 w-full bg-gray-100 rounded mt-2" />
                    <div className="h-0.5 w-full bg-gray-100 rounded" />
                    <div className="h-0.5 w-3/4 bg-gray-100 rounded" />
                    <div className="h-0.5 w-full bg-gray-100 rounded mt-1.5" />
                    <div className="h-0.5 w-full bg-gray-100 rounded" />
                    <div className="h-0.5 w-1/2 bg-gray-100 rounded" />
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground text-sm mb-1">{template.name}</h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{template.description}</p>
                <Link href={`/resume/builder?template=${template.id}`}>
                  <Button size="sm" className="w-full bg-accent hover:bg-accent/90 text-white text-xs">
                    Use Template
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
