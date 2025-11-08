import { scoreResume } from "@/lib/ats-scorer"
import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { resume_id, job_id } = await request.json()

    // Fetch resume
    const { data: resume } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", resume_id)
      .eq("user_id", user.id)
      .single()

    // Fetch job
    const { data: job } = await supabase.from("job_postings").select("*").eq("id", job_id).single()

    if (!resume || !job) {
      return NextResponse.json({ error: "Resume or job not found" }, { status: 404 })
    }

    // Calculate score
    const score = scoreResume(resume.content, job.description)

    // Update application with score if exists
    const { data: application } = await supabase
      .from("applications")
      .select("id")
      .eq("user_id", user.id)
      .eq("job_id", job_id)
      .eq("resume_id", resume_id)
      .single()

    if (application) {
      await supabase.from("applications").update({ ats_match_score: score.overallScore }).eq("id", application.id)
    }

    return NextResponse.json(score)
  } catch (error) {
    console.error("Score calculation error:", error)
    return NextResponse.json({ error: "Failed to calculate score" }, { status: 500 })
  }
}
