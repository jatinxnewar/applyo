import { generateText } from "ai"
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
    const { job_id, resume_id, company_name, position } = await request.json()

    // Fetch resume
    const { data: resume } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", resume_id)
      .eq("user_id", user.id)
      .single()

    // Fetch job details
    const { data: job } = await supabase.from("job_postings").select("*").eq("id", job_id).single()

    const prompt = `You are an expert career coach specializing in cover letters. Write a professional, compelling cover letter for the following position.

APPLICANT DETAILS:
- Name: ${resume?.content.personal.full_name}
- Email: ${resume?.content.personal.email}
- Skills: ${resume?.content.skills.join(", ")}
- Experience: ${resume?.content.experience.map((e: any) => `${e.position} at ${e.company}`).join(", ")}

POSITION DETAILS:
- Company: ${company_name}
- Position: ${position}
- Job Description: ${job?.description}
- Requirements: ${job?.requirements}

Write a professional cover letter (3-4 paragraphs, 250-300 words) that:
1. Opens with enthusiasm for the specific role and company
2. Highlights relevant experience and accomplishments
3. Demonstrates knowledge of the company
4. Shows alignment with job requirements
5. Closes with a clear call to action

Format the response as plain text, ready to be used as a cover letter.`

    const { text } = await generateText({
      model: "google/gemini-1.5-flash",
      prompt,
      temperature: 0.8,
    })

    return NextResponse.json({
      cover_letter: text,
      generated_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Cover letter generation error:", error)
    return NextResponse.json({ error: "Failed to generate cover letter" }, { status: 500 })
  }
}
