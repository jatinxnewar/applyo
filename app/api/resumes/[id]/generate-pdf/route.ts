import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

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
    // Fetch resume
    const { data: resume, error: resumeError } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (resumeError || !resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    // Generate LaTeX
    const latex = generateLatex(resume.content, resume.template_id || "modern")

    // Call external PDF generation service or library
    const pdfBuffer = await generatePdfFromLatex(latex)

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${resume.title}.pdf"`,
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}

function generateLatex(content: any, template: string): string {
  const { personal, summary, experience, education, skills } = content

  const experienceLatex = experience
    .map(
      (exp: any) => `
    \\textbf{${escapeLatex(exp.position)}} \\hfill ${escapeLatex(exp.duration)} \\\\
    \\textit{${escapeLatex(exp.company)}} \\\\
    ${escapeLatex(exp.description)} \\\\[0.3cm]
  `,
    )
    .join("")

  const educationLatex = education
    .map(
      (edu: any) => `
    \\textbf{${escapeLatex(edu.degree)}} \\hfill ${escapeLatex(edu.year)} \\\\
    ${escapeLatex(edu.school)} -- ${escapeLatex(edu.field)} \\\\[0.3cm]
  `,
    )
    .join("")

  const skillsLatex = skills.join(", ")

  const latex = `
\\documentclass[11pt]{article}
\\usepackage[utf-8]{inputenc}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{hyperref}
\\usepackage{xcolor}
\\usepackage{fontawesome5}

\\definecolor{accentcolor}{RGB}{14, 165, 233}

\\pagestyle{empty}

\\begin{document}

% Header
{\\centering
  {\\Large \\textbf{${escapeLatex(personal.full_name)}}} \\\\[0.2cm]
  ${personal.email ? `${escapeLatex(personal.email)}` : ""} ${personal.phone ? `\\, | \\, ${escapeLatex(personal.phone)}` : ""} ${personal.location ? `\\, | \\, ${escapeLatex(personal.location)}` : ""} \\\\[0.3cm]
}

% Summary
${
  summary
    ? `
\\section*{\\textcolor{accentcolor}{PROFESSIONAL SUMMARY}}
\\noindent
${escapeLatex(summary)} \\\\[0.3cm]
`
    : ""
}

% Experience
${
  experience.length > 0
    ? `
\\section*{\\textcolor{accentcolor}{EXPERIENCE}}
${experienceLatex}
`
    : ""
}

% Education
${
  education.length > 0
    ? `
\\section*{\\textcolor{accentcolor}{EDUCATION}}
${educationLatex}
`
    : ""
}

% Skills
${
  skills.length > 0
    ? `
\\section*{\\textcolor{accentcolor}{SKILLS}}
\\noindent
${skillsLatex}
`
    : ""
}

\\end{document}
  `

  return latex
}

function escapeLatex(text: string): string {
  if (!text) return ""
  return text.replace(/\\/g, "\\textbackslash{}").replace(/[&%$#_{}~^]/g, (char) => {
    const escapeMap: Record<string, string> = {
      "&": "\\&",
      "%": "\\%",
      $: "\\$",
      "#": "\\#",
      _: "\\_",
      "{": "\\{",
      "}": "\\}",
      "~": "\\textasciitilde{}",
      "^": "\\textasciicircum{}",
    }
    return escapeMap[char] || char
  })
}

async function generatePdfFromLatex(latex: string): Promise<Buffer> {
  // Use a serverless LaTeX service like QuickLatex or Overleaf API
  // For now, returning a placeholder buffer - in production, integrate with:
  // - Overleaf API
  // - QuickLatex API
  // - Or run pdflatex locally

  const response = await fetch("https://www.quicklatex.com/api/v3/pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      formula: latex,
      fsize: "14px",
      preamble: "\\usepackage{amsmath}",
    }).toString(),
  })

  if (!response.ok) {
    throw new Error("Failed to generate PDF from LaTeX")
  }

  return Buffer.from(await response.arrayBuffer())
}
