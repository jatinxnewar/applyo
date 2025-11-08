import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { status } = await request.json()

  try {
    // Get application
    const { data: application } = await supabase.from("applications").select("*").eq("id", id).single()

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Get job to verify ownership
    const { data: job } = await supabase
      .from("job_postings")
      .select("*")
      .eq("id", application.job_id)
      .eq("employer_id", user.id)
      .single()

    if (!job) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update application status
    const { data: updated, error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // Log tracking event
    await supabase.from("applicant_tracking").insert({
      application_id: id,
      employer_id: user.id,
      event_type: status === "accepted" ? "offer_extended" : status === "shortlisted" ? "shortlisted" : "reviewed",
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Status update error:", error)
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
}
