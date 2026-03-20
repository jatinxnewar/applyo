import type { User, Resume, JobPosting, Application, ResumeContent } from "@/lib/types"

export const DEMO_USER: User = {
  id: "demo-user-1",
  email: "demo@applyo.com",
  full_name: "Alex Johnson",
  avatar_url: "",
  bio: "Full-stack developer with 5 years of experience building web applications. Passionate about clean code and great user experiences.",
  location: "San Francisco, CA",
  phone: "+1 (555) 123-4567",
  linkedin_url: "https://linkedin.com/in/alexjohnson",
  github_url: "https://github.com/alexjohnson",
  portfolio_url: "https://alexjohnson.dev",
  user_type: "professional",
  subscription_tier: "pro",
  created_at: "2025-09-15T00:00:00Z",
  updated_at: "2026-03-20T00:00:00Z",
}

const resumeContent: ResumeContent = {
  personal: {
    full_name: "Alex Johnson",
    email: "demo@applyo.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    links: [
      { label: "LinkedIn", url: "https://linkedin.com/in/alexjohnson" },
      { label: "GitHub", url: "https://github.com/alexjohnson" },
    ],
  },
  summary:
    "Experienced full-stack developer with 5+ years building scalable web applications using React, Node.js, and cloud technologies. Led engineering teams to deliver products used by 100K+ users.",
  experience: [
    {
      company: "TechCorp Inc.",
      position: "Senior Software Engineer",
      duration: "Jan 2023 - Present",
      description:
        "Lead a team of 5 engineers building a SaaS analytics platform. Reduced API response time by 40% through query optimization. Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes.",
    },
    {
      company: "StartupXYZ",
      position: "Full Stack Developer",
      duration: "Jun 2021 - Dec 2022",
      description:
        "Built and maintained core product features serving 50K+ monthly active users. Developed real-time notification system using WebSockets. Migrated legacy codebase from JavaScript to TypeScript.",
    },
    {
      company: "WebAgency Co.",
      position: "Junior Developer",
      duration: "Aug 2019 - May 2021",
      description:
        "Developed responsive web applications for 15+ clients across industries. Collaborated with designers to implement pixel-perfect UIs. Introduced automated testing practices, improving code coverage from 20% to 80%.",
    },
  ],
  education: [
    {
      school: "University of California, Berkeley",
      degree: "B.S.",
      field: "Computer Science",
      year: "2019",
    },
  ],
  skills: [
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "PostgreSQL",
    "AWS",
    "Docker",
    "GraphQL",
    "Next.js",
    "Tailwind CSS",
  ],
  certifications: [
    { name: "AWS Solutions Architect", issuer: "Amazon Web Services", date: "2024" },
  ],
}

export const DEMO_RESUMES: Resume[] = [
  {
    id: "resume-1",
    user_id: "demo-user-1",
    title: "Software Engineer Resume",
    template_id: "modern",
    content: resumeContent,
    ats_score: 92,
    created_at: "2026-02-10T00:00:00Z",
    updated_at: "2026-03-18T00:00:00Z",
  },
  {
    id: "resume-2",
    user_id: "demo-user-1",
    title: "Full Stack Developer",
    template_id: "classic",
    content: {
      ...resumeContent,
      summary:
        "Versatile full-stack developer proficient in modern web technologies. Strong background in building RESTful APIs and responsive front-end applications.",
    },
    ats_score: 78,
    created_at: "2026-01-20T00:00:00Z",
    updated_at: "2026-03-05T00:00:00Z",
  },
  {
    id: "resume-3",
    user_id: "demo-user-1",
    title: "Tech Lead Application",
    template_id: "minimalist",
    content: {
      ...resumeContent,
      summary:
        "Engineering leader with experience managing teams and delivering high-impact products. Combines deep technical expertise with strong communication skills.",
    },
    ats_score: 85,
    created_at: "2026-03-01T00:00:00Z",
    updated_at: "2026-03-15T00:00:00Z",
  },
]

export const DEMO_JOBS: JobPosting[] = [
  {
    id: "job-1",
    employer_id: "emp-1",
    title: "Senior Frontend Engineer",
    description:
      "We're looking for a Senior Frontend Engineer to lead the development of our next-generation web application. You'll work closely with design and product teams to create intuitive, performant user interfaces that delight our customers. The ideal candidate has strong experience with React, TypeScript, and modern CSS frameworks.",
    requirements: "5+ years of frontend experience, React, TypeScript, CSS, team leadership",
    salary_range: { min: 140000, max: 180000, currency: "USD" },
    location: "San Francisco, CA (Hybrid)",
    job_type: "full-time",
    status: "open",
    posted_at: "2026-03-19T00:00:00Z",
    created_at: "2026-03-19T00:00:00Z",
    updated_at: "2026-03-19T00:00:00Z",
  },
  {
    id: "job-2",
    employer_id: "emp-2",
    title: "Full Stack Developer",
    description:
      "Join our growing engineering team to build scalable web applications. You'll be working across the full stack, from designing database schemas to implementing responsive UIs. We value clean code, thorough testing, and collaborative development practices.",
    requirements: "3+ years experience, Node.js, React, PostgreSQL, AWS",
    salary_range: { min: 110000, max: 150000, currency: "USD" },
    location: "New York, NY (Remote)",
    job_type: "full-time",
    status: "open",
    posted_at: "2026-03-18T00:00:00Z",
    created_at: "2026-03-18T00:00:00Z",
    updated_at: "2026-03-18T00:00:00Z",
  },
  {
    id: "job-3",
    employer_id: "emp-3",
    title: "React Native Developer",
    description:
      "We're building the future of mobile commerce and need a talented React Native developer to help us ship features fast. You'll work on our iOS and Android apps, implementing new features and optimizing performance for millions of users.",
    requirements: "3+ years React Native, mobile development, REST APIs, Git",
    salary_range: { min: 120000, max: 160000, currency: "USD" },
    location: "Austin, TX (On-site)",
    job_type: "full-time",
    status: "open",
    posted_at: "2026-03-17T00:00:00Z",
    created_at: "2026-03-17T00:00:00Z",
    updated_at: "2026-03-17T00:00:00Z",
  },
  {
    id: "job-4",
    employer_id: "emp-4",
    title: "DevOps Engineer",
    description:
      "Help us scale our infrastructure to serve millions of users globally. You'll design and manage CI/CD pipelines, monitor system health, and implement best practices for cloud-native applications on AWS and Kubernetes.",
    requirements: "AWS, Kubernetes, Docker, Terraform, CI/CD, monitoring",
    salary_range: { min: 130000, max: 170000, currency: "USD" },
    location: "Seattle, WA (Remote)",
    job_type: "full-time",
    status: "open",
    posted_at: "2026-03-16T00:00:00Z",
    created_at: "2026-03-16T00:00:00Z",
    updated_at: "2026-03-16T00:00:00Z",
  },
  {
    id: "job-5",
    employer_id: "emp-5",
    title: "Product Design Intern",
    description:
      "Great opportunity for a design student to gain hands-on experience at a fast-growing startup. You'll shadow senior designers, contribute to real projects, and learn our design system built on Figma.",
    requirements: "Enrolled in design program, Figma, prototyping, portfolio",
    salary_range: { min: 25, max: 35, currency: "USD" },
    location: "Los Angeles, CA (On-site)",
    job_type: "internship",
    status: "open",
    posted_at: "2026-03-15T00:00:00Z",
    created_at: "2026-03-15T00:00:00Z",
    updated_at: "2026-03-15T00:00:00Z",
  },
  {
    id: "job-6",
    employer_id: "emp-1",
    title: "Backend Engineer (Python)",
    description:
      "We need a Backend Engineer to help us build robust APIs and data pipelines. You'll work with Python, FastAPI, and PostgreSQL to create services that power our platform. Experience with microservices and event-driven architecture is a plus.",
    requirements: "Python, FastAPI/Django, PostgreSQL, REST APIs, microservices",
    salary_range: { min: 120000, max: 155000, currency: "USD" },
    location: "Chicago, IL (Hybrid)",
    job_type: "full-time",
    status: "open",
    posted_at: "2026-03-14T00:00:00Z",
    created_at: "2026-03-14T00:00:00Z",
    updated_at: "2026-03-14T00:00:00Z",
  },
]

export const DEMO_APPLICATIONS: (Application & { job: JobPosting })[] = [
  {
    id: "app-1",
    user_id: "demo-user-1",
    job_id: "job-1",
    resume_id: "resume-1",
    status: "reviewed",
    ats_match_score: 92,
    applied_at: "2026-03-19T10:00:00Z",
    created_at: "2026-03-19T10:00:00Z",
    updated_at: "2026-03-20T08:00:00Z",
    job: DEMO_JOBS[0],
  },
  {
    id: "app-2",
    user_id: "demo-user-1",
    job_id: "job-2",
    resume_id: "resume-1",
    status: "submitted",
    ats_match_score: 87,
    applied_at: "2026-03-18T14:00:00Z",
    created_at: "2026-03-18T14:00:00Z",
    updated_at: "2026-03-18T14:00:00Z",
    job: DEMO_JOBS[1],
  },
  {
    id: "app-3",
    user_id: "demo-user-1",
    job_id: "job-4",
    resume_id: "resume-2",
    status: "accepted",
    ats_match_score: 74,
    applied_at: "2026-03-10T09:00:00Z",
    created_at: "2026-03-10T09:00:00Z",
    updated_at: "2026-03-17T11:00:00Z",
    job: DEMO_JOBS[3],
  },
  {
    id: "app-4",
    user_id: "demo-user-1",
    job_id: "job-6",
    resume_id: "resume-3",
    status: "rejected",
    ats_match_score: 61,
    applied_at: "2026-03-05T16:00:00Z",
    created_at: "2026-03-05T16:00:00Z",
    updated_at: "2026-03-14T10:00:00Z",
    job: DEMO_JOBS[5],
  },
]
