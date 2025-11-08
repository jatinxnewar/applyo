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
    const { resume_id } = await request.json()

    const { data: resume } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", resume_id)
      .eq("user_id", user.id)
      .single()

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    const prompt = `Analyze this resume for quality, ATS compatibility, and professional impact. Provide detailed feedback.

RESUME:
${JSON.stringify(resume.content, null, 2)}

Provide analysis in this JSON format:
{
  "ats_score": <0-100>,
  "professionalism_score": <0-100>,
  "completeness_score": <0-100>,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "ats_issues": ["issue1", "issue2"],
  "recommendations": ["rec1", "rec2"],
  "keywords_count": <number>,
  "readability_level": "easy|moderate|difficult"
}`

    const { text } = await generateText({
      model: "google/gemini-1.5-flash",
      prompt,
      temperature: 0.5,
    })

    try {
      const analysis = JSON.parse(text)
      return NextResponse.json(analysis)
    } catch {
      return NextResponse.json({ raw_analysis: text })
    }
  } catch (error) {
    console.error("Resume analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 })
  }
}
