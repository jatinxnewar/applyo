import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { getLatexGenerator } from "@/lib/latex-generator"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const { data: resume, error: resumeError } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (resumeError || !resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    // Get appropriate LaTeX generator based on template
    const generator = getLatexGenerator((resume.template_id || "modern") as any)

    // Generate LaTeX
    const latex = generator(resume.content)

    // Return LaTeX as downloadable file
    return new NextResponse(latex, {
      headers: {
        "Content-Type": "application/x-latex",
        "Content-Disposition": `attachment; filename="${resume.title}.tex"`,
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Failed to generate LaTeX" }, { status: 500 })
  }
}
