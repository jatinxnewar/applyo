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
    const { resume_id, job_description } = await request.json()

    // Fetch resume
    const { data: resume, error: resumeError } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", resume_id)
      .eq("user_id", user.id)
      .single()

    if (resumeError || !resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    const prompt = `You are an expert resume optimizer. Analyze the following resume and job description, then provide specific, actionable improvements to make the resume more ATS-friendly and better aligned with the job requirements.

RESUME CONTENT:
${JSON.stringify(resume.content, null, 2)}

JOB DESCRIPTION:
${job_description}

Provide your analysis in the following JSON format:
{
  "overall_score": <0-100>,
  "improvements": [
    {
      "section": "experience|education|skills|summary",
      "issue": "description of the issue",
      "suggestion": "specific improvement to make",
      "priority": "high|medium|low"
    }
  ],
  "keywords_to_add": ["keyword1", "keyword2"],
  "rewritten_summary": "improved professional summary",
  "ats_tips": ["tip1", "tip2"]
}`

    const { text } = await generateText({
      model: "google/gemini-1.5-flash",
      prompt,
      temperature: 0.7,
    })

    try {
      const analysis = JSON.parse(text)
      return NextResponse.json(analysis)
    } catch {
      return NextResponse.json({ raw_analysis: text })
    }
  } catch (error) {
    console.error("Resume optimization error:", error)
    return NextResponse.json({ error: "Failed to optimize resume" }, { status: 500 })
  }
}
