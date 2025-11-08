export type UserType = "student" | "professional" | "admin"
export type SubscriptionTier = "free" | "pro" | "enterprise"
export type TemplateType = "modern" | "classic" | "minimalist" | "creative"
export type JobType = "full-time" | "part-time" | "contract" | "internship"
export type ApplicationStatus = "draft" | "submitted" | "reviewed" | "accepted" | "rejected" | "withdrawn"
export type JobPostingStatus = "open" | "closed" | "filled"

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  bio?: string
  location?: string
  phone?: string
  linkedin_url?: string
  github_url?: string
  portfolio_url?: string
  user_type: UserType
  subscription_tier: SubscriptionTier
  created_at: string
  updated_at: string
}

export interface Resume {
  id: string
  user_id: string
  title: string
  template_id?: string
  content: ResumeContent
  pdf_url?: string
  ats_score?: number
  last_generated_at?: string
  created_at: string
  updated_at: string
}

export interface ResumeContent {
  personal: {
    full_name: string
    email: string
    phone?: string
    location?: string
    links?: { label: string; url: string }[]
  }
  summary?: string
  experience: {
    company: string
    position: string
    duration: string
    description: string
  }[]
  education: {
    school: string
    degree: string
    field: string
    year: string
  }[]
  skills: string[]
  certifications?: {
    name: string
    issuer: string
    date: string
  }[]
}

export interface JobPosting {
  id: string
  employer_id: string
  title: string
  description: string
  requirements?: string
  salary_range?: { min: number; max: number; currency: string }
  location: string
  job_type: JobType
  status: JobPostingStatus
  posted_at: string
  deadline?: string
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  user_id: string
  job_id: string
  resume_id?: string
  cover_letter?: string
  status: ApplicationStatus
  ats_match_score?: number
  applied_at: string
  created_at: string
  updated_at: string
}
