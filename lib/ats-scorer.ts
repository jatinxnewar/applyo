/**
 * ATS Scoring Engine
 * Analyzes resume content and job descriptions for compatibility
 */

export interface ATSScore {
  overallScore: number
  skillsMatch: number
  experienceMatch: number
  educationMatch: number
  keywordsMatch: number
  formatScore: number
  details: {
    matchedSkills: string[]
    missingSkills: string[]
    matchedKeywords: string[]
    missingKeywords: string[]
    suggestions: string[]
  }
}

export function parseJobDescription(description: string): {
  keywords: string[]
  skills: string[]
  experiences: string[]
} {
  // Common skill keywords
  const commonSkills = [
    "python",
    "javascript",
    "typescript",
    "react",
    "node",
    "sql",
    "java",
    "c++",
    "project management",
    "leadership",
    "communication",
    "data analysis",
    "machine learning",
    "cloud",
    "aws",
    "docker",
    "kubernetes",
    "git",
    "agile",
    "scrum",
  ]

  const text = description.toLowerCase()
  const foundSkills = commonSkills.filter((skill) => text.includes(skill.toLowerCase()))

  // Extract years of experience patterns
  const expPattern = /(\d+)\+?\s*years?\s+of\s+experience/gi
  const experiences = []
  let match
  while ((match = expPattern.exec(text)) !== null) {
    experiences.push(match[0])
  }

  // Extract all capitalized phrases as potential keywords
  const keywords = [
    ...new Set(
      description
        .split(/[,.\n]/)
        .map((phrase) => phrase.trim())
        .filter((phrase) => phrase.length > 2 && /[A-Z]/.test(phrase[0])),
    ),
  ].slice(0, 20)

  return {
    keywords,
    skills: foundSkills,
    experiences,
  }
}

export function scoreResume(resumeContent: any, jobDescription: string): ATSScore {
  const jobData = parseJobDescription(jobDescription)
  const resumeText = JSON.stringify(resumeContent).toLowerCase()

  // Skills matching
  const resumeSkills = resumeContent.skills.map((s: string) => s.toLowerCase())
  const matchedSkills = jobData.skills.filter((skill) => resumeSkills.some((rSkill) => rSkill.includes(skill)))
  const missingSkills = jobData.skills.filter((skill) => !matchedSkills.includes(skill))
  const skillsScore = jobData.skills.length > 0 ? (matchedSkills.length / jobData.skills.length) * 100 : 50

  // Keywords matching
  const matchedKeywords = jobData.keywords.filter((keyword) => resumeText.includes(keyword.toLowerCase()))
  const keywordsScore = jobData.keywords.length > 0 ? (matchedKeywords.length / jobData.keywords.length) * 100 : 50

  // Experience scoring
  let experienceScore = 50
  if (resumeContent.experience && resumeContent.experience.length > 0) {
    experienceScore = Math.min(100, 50 + resumeContent.experience.length * 10)
  }

  // Education scoring
  let educationScore = 50
  if (resumeContent.education && resumeContent.education.length > 0) {
    educationScore = Math.min(100, 60 + resumeContent.education.length * 15)
  }

  // Format score (completeness)
  const hasAllSections =
    resumeContent.personal &&
    resumeContent.personal.full_name &&
    resumeContent.personal.email &&
    resumeContent.experience &&
    resumeContent.experience.length > 0
  const formatScore = hasAllSections ? 90 : 70

  // Overall score (weighted average)
  const overallScore = Math.round(
    skillsScore * 0.3 + keywordsScore * 0.25 + experienceScore * 0.2 + educationScore * 0.15 + formatScore * 0.1,
  )

  // Suggestions
  const suggestions: string[] = []
  if (skillsScore < 60) suggestions.push("Add more relevant skills")
  if (keywordsScore < 70) suggestions.push("Include more job-specific keywords")
  if (!resumeContent.summary) suggestions.push("Add a professional summary")
  if (resumeContent.experience.length < 2) suggestions.push("Add more work experience entries")
  if (missingSkills.length > 0) suggestions.push(`Consider adding: ${missingSkills.slice(0, 3).join(", ")}`)

  return {
    overallScore,
    skillsMatch: Math.round(skillsScore),
    experienceMatch: Math.round(experienceScore),
    educationMatch: Math.round(educationScore),
    keywordsMatch: Math.round(keywordsScore),
    formatScore: Math.round(formatScore),
    details: {
      matchedSkills,
      missingSkills,
      matchedKeywords,
      missingKeywords: jobData.keywords.filter((k) => !matchedKeywords.includes(k)),
      suggestions,
    },
  }
}

export function calculateJDRequirements(jobDescription: string): {
  requiredSkills: string[]
  minExperience: number
  requirements: string[]
} {
  const lines = jobDescription.split("\n")
  const requiredSkills = parseJobDescription(jobDescription).skills

  const expMatch = jobDescription.match(/(\d+)\+?\s*years?\s+of\s+experience/i)
  const minExperience = expMatch ? Number.parseInt(expMatch[1]) : 0

  const requirements = lines
    .filter((line) => line.trim().startsWith("-") || line.trim().startsWith("•"))
    .map((line) => line.trim().slice(1).trim())
    .slice(0, 10)

  return {
    requiredSkills,
    minExperience,
    requirements,
  }
}
