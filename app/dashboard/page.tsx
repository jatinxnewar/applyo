import { getSession } from "@/lib/auth0"
import { redirect } from "next/navigation"
import { DEMO_USER, DEMO_RESUMES, DEMO_JOBS } from "@/lib/demo-data"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  let user = DEMO_USER
  let resumes = DEMO_RESUMES
  let jobs = DEMO_JOBS

  try {
    const { getDatabase } = await import("@/lib/mongodb/client")
    const { ObjectId } = await import("mongodb")
    const db = await getDatabase()
    const usersCollection = db.collection("users")
    const resumesCollection = db.collection("resumes")
    const jobsCollection = db.collection("job_postings")

    const dbUser = await usersCollection.findOne({ auth0_id: session.user.sub })
    if (dbUser) {
      user = { ...DEMO_USER, ...dbUser, id: dbUser._id.toString() } as any

      const dbResumes = await resumesCollection
        .find({ user_id: new ObjectId(dbUser._id) })
        .sort({ created_at: -1 })
        .toArray()
      if (dbResumes.length > 0) resumes = dbResumes as any

      const dbJobs = await jobsCollection.find({ status: "open" }).sort({ created_at: -1 }).limit(6).toArray()
      if (dbJobs.length > 0) jobs = dbJobs as any
    }
  } catch {
    // DB not available — use demo data
  }

  return <DashboardClient user={user} resumes={resumes} jobs={jobs} />
}
