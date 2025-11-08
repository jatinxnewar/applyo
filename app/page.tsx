import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <header className="border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="text-xl font-bold text-foreground">Applyo</span>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-accent hover:bg-accent/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-20 text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance">
            Build Your Resume.
            <br />
            <span className="text-accent">Land Your Dream Job.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Create stunning, ATS-optimized resumes and apply to curated job opportunities—all in one platform.
          </p>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <Link href="/auth/signup">
            <Button size="lg" className="bg-accent hover:bg-accent/90">
              Start Free →
            </Button>
          </Link>
          <Link href="/jobs">
            <Button size="lg" variant="outline">
              Browse Jobs
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground">Premium Templates</h3>
            <p className="text-sm text-muted-foreground">Choose from professionally designed resume templates</p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground">ATS Optimization</h3>
            <p className="text-sm text-muted-foreground">Get real-time ATS scoring and optimization tips</p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground">Job Matching</h3>
            <p className="text-sm text-muted-foreground">Discover opportunities matched to your profile</p>
          </div>
        </div>
      </main>
    </div>
  )
}
