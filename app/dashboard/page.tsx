import { getSession } from "@/lib/auth0"
import { redirect } from "next/navigation"
import { getDatabase } from "@/lib/mongodb/client"
import { ObjectId } from "mongodb"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ResumeGrid } from "@/components/dashboard/resume-grid"
import { JobBoard } from "@/components/dashboard/job-board"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  try {
    const db = await getDatabase()
    const usersCollection = db.collection("users")
    const resumesCollection = db.collection("resumes")
    const jobsCollection = db.collection("job_postings")

    const user = await usersCollection.findOne({ auth0_id: session.user.sub })

    if (!user) {
      redirect("/auth/login")
    }

    // Get user's resumes
    const resumes = await resumesCollection
      .find({ user_id: new ObjectId(user._id) })
      .sort({ created_at: -1 })
      .toArray()

    // Get open job postings
    const jobs = await jobsCollection.find({ status: "open" }).sort({ created_at: -1 }).limit(6).toArray()

    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader user={user} />

        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="space-y-12">
            {/* Resumes Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Your Resumes</h2>
                  <p className="text-sm text-muted-foreground mt-1">Create and manage your professional resumes</p>
                </div>
                <Link href="/resume/builder">
                  <Button className="bg-accent hover:bg-accent/90 transition-all duration-300">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Resume
                  </Button>
                </Link>
              </div>
              <ResumeGrid resumes={resumes || []} />
            </section>

            {/* Job Board Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Available Opportunities</h2>
                  <p className="text-sm text-muted-foreground mt-1">Explore jobs and apply with your resume</p>
                </div>
                <Link href="/jobs">
                  <Button variant="outline" className="transition-all duration-300 bg-transparent">
                    View All Jobs
                  </Button>
                </Link>
              </div>
              <JobBoard jobs={jobs || []} />
            </section>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error("Dashboard error:", error)
    redirect("/auth/login")
  }
}
