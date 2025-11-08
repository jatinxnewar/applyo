import type { ResumeContent } from "./types"

export interface LatexOptions {
  template?: "modern" | "classic" | "minimalist" | "creative"
  colors?: {
    primary: string
    accent: string
    text: string
  }
}

export function generateModernLatex(content: ResumeContent, options: LatexOptions = {}): string {
  const colors = options.colors || {
    primary: "1e293b",
    accent: "0ea5e9",
    text: "0f172a",
  }

  const experienceSection = content.experience
    .map(
      (exp) => `
\\vspace{0.1cm}
\\noindent
\\textbf{\\Large ${escapeLatex(exp.position)}} \\hfill \\textit{${escapeLatex(exp.duration)}} \\\\
\\textbf{${escapeLatex(exp.company)}} \\\\
\\small ${escapeLatex(exp.description)} \\\\
`,
    )
    .join("\n")

  const educationSection = content.education
    .map(
      (edu) => `
\\vspace{0.1cm}
\\noindent
\\textbf{\\large ${escapeLatex(edu.degree)}} \\hfill \\textit{${escapeLatex(edu.year)}} \\\\
\\textbf{${escapeLatex(edu.school)}} \\\\
\\small ${escapeLatex(edu.field)} \\\\
`,
    )
    .join("\n")

  const skillsList = content.skills.map((skill) => escapeLatex(skill)).join(", ")

  const latex = `
\\documentclass[11pt, letterpaper]{article}

\\usepackage[margin=0.5in]{geometry}
\\usepackage{fontspec}
\\usepackage{hyperref}
\\usepackage{xcolor}
\\usepackage{fontawesome5}
\\usepackage{paracol}

\\definecolor{primary}{HTML}{${colors.primary}}
\\definecolor{accent}{HTML}{${colors.accent}}
\\definecolor{text}{HTML}{${colors.text}}

\\color{text}
\\pagestyle{empty}

\\begin{document}

% Header Section
{\\fontsize{28}{32}\\selectfont\\textbf{${escapeLatex(content.personal.full_name)}}} \\\\
\\vspace{0.1cm}
${[content.personal.email, content.personal.phone, content.personal.location]
  .filter(Boolean)
  .map((item) => escapeLatex(item || ""))
  .join(" $|$ ")}
\\vspace{0.3cm}
\\hrule
\\vspace{0.2cm}

% Professional Summary
${
  content.summary
    ? `
\\section*{\\textcolor{accent}{$\\diamond$ PROFESSIONAL SUMMARY}}
${escapeLatex(content.summary)}
\\vspace{0.2cm}
`
    : ""
}

% Work Experience
${
  content.experience.length > 0
    ? `
\\section*{\\textcolor{accent}{$\\diamond$ WORK EXPERIENCE}}
${experienceSection}
\\vspace{0.2cm}
`
    : ""
}

% Education
${
  content.education.length > 0
    ? `
\\section*{\\textcolor{accent}{$\\diamond$ EDUCATION}}
${educationSection}
\\vspace{0.2cm}
`
    : ""
}

% Skills
${
  content.skills.length > 0
    ? `
\\section*{\\textcolor{accent}{$\\diamond$ SKILLS}}
${skillsList}
`
    : ""
}

\\end{document}
  `

  return latex
}

export function generateClassicLatex(content: ResumeContent, options: LatexOptions = {}): string {
  const experienceSection = content.experience
    .map(
      (exp) => `
\\noindent
\\textbf{${escapeLatex(exp.position)}} \\hfill ${escapeLatex(exp.duration)} \\\\
\\textit{${escapeLatex(exp.company)}} \\\\
${escapeLatex(exp.description)} \\vspace{0.15cm} \\\\
`,
    )
    .join("\n")

  const educationSection = content.education
    .map(
      (edu) => `
\\noindent
\\textbf{${escapeLatex(edu.degree)}} \\hfill ${escapeLatex(edu.year)} \\\\
${escapeLatex(edu.school)} --- ${escapeLatex(edu.field)} \\vspace{0.15cm} \\\\
`,
    )
    .join("\n")

  const skillsList = content.skills.map((skill) => escapeLatex(skill)).join(", ")

  return `
\\documentclass[11pt, letterpaper]{article}

\\usepackage[margin=0.75in]{geometry}
\\usepackage[T1]{fontenc}
\\usepackage{garamond}

\\pagestyle{empty}

\\begin{document}

% Header
{\\centering
  {\\large\\textbf{${escapeLatex(content.personal.full_name)}}} \\\\
  ${[content.personal.email, content.personal.phone, content.personal.location]
    .filter(Boolean)
    .map((item) => escapeLatex(item || ""))
    .join(" $\\cdot$ ")} \\\\
}

% Professional Summary
${
  content.summary
    ? `
\\section*{PROFESSIONAL SUMMARY}
${escapeLatex(content.summary)}
`
    : ""
}

% Work Experience
${
  content.experience.length > 0
    ? `
\\section*{WORK EXPERIENCE}
${experienceSection}
`
    : ""
}

% Education
${
  content.education.length > 0
    ? `
\\section*{EDUCATION}
${educationSection}
`
    : ""
}

% Skills
${
  content.skills.length > 0
    ? `
\\section*{SKILLS}
${skillsList}
`
    : ""
}

\\end{document}
  `
}

export function generateMinimalistLatex(content: ResumeContent, options: LatexOptions = {}): string {
  const experienceSection = content.experience
    .map(
      (exp) => `
\\noindent\\textbf{${escapeLatex(exp.position)}} | ${escapeLatex(exp.duration)} \\\\
${escapeLatex(exp.company)} \\\\
${escapeLatex(exp.description)} \\\\[6pt]
`,
    )
    .join("\n")

  return `
\\documentclass[10pt, letterpaper]{article}

\\usepackage[margin=0.6in]{geometry}
\\usepackage{helvet}
\\renewcommand{\\familydefault}{\\sfdefault}

\\pagestyle{empty}

\\begin{document}

{\\raggedright
  {\\LARGE\\textbf{${escapeLatex(content.personal.full_name)}}}\\\\[3pt]
  ${[content.personal.email, content.personal.phone, content.personal.location]
    .filter(Boolean)
    .map((item) => escapeLatex(item || ""))
    .join(" · ")}
}

\\vspace{8pt}\\hrule\\vspace{8pt}

${
  content.summary
    ? `
\\section*{PROFILE}
${escapeLatex(content.summary)}
\\vspace{6pt}
`
    : ""
}

${
  content.experience.length > 0
    ? `
\\section*{EXPERIENCE}
${experienceSection}
`
    : ""
}

${
  content.education.length > 0
    ? `
\\section*{EDUCATION}
${content.education
  .map((edu) => `${escapeLatex(edu.degree)}, ${escapeLatex(edu.school)} (${escapeLatex(edu.year)})`)
  .join(" \\\\[3pt] ")}
`
    : ""
}

${
  content.skills.length > 0
    ? `
\\section*{SKILLS}
${content.skills.map((skill) => escapeLatex(skill)).join(", ")}
`
    : ""
}

\\end{document}
  `
}

export function escapeLatex(text: string): string {
  if (!text) return ""

  let escaped = text

  // Order matters: process backslash first
  escaped = escaped.replace(/\\/g, "\\textbackslash{}")

  // Then other special characters
  const specialChars: Record<string, string> = {
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

  for (const [char, replacement] of Object.entries(specialChars)) {
    escaped = escaped.replace(new RegExp(`\\${char}`, "g"), replacement)
  }

  return escaped
}

export function getLatexGenerator(template: "modern" | "classic" | "minimalist" | "creative" = "modern") {
  switch (template) {
    case "classic":
      return generateClassicLatex
    case "minimalist":
      return generateMinimalistLatex
    case "modern":
    case "creative":
    default:
      return generateModernLatex
  }
}
