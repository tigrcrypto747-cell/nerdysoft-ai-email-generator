import { NextRequest, NextResponse } from "next/server";
import {
  emailGeneratorService,
  type EmailTone,
  type EmailLength,
} from "@/lib/email-generator";
import { createClient } from "@/lib/supabase/server";

const VALID_TONES: EmailTone[] = ["formal", "friendly", "persuasive", "casual"];
const VALID_LENGTHS: EmailLength[] = ["short", "medium", "long"];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { topic, tone, length } = body as Record<string, unknown>;

  if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
    return NextResponse.json({ error: "topic is required" }, { status: 422 });
  }
  if (!VALID_TONES.includes(tone as EmailTone)) {
    return NextResponse.json(
      { error: `tone must be one of: ${VALID_TONES.join(", ")}` },
      { status: 422 }
    );
  }
  if (!VALID_LENGTHS.includes(length as EmailLength)) {
    return NextResponse.json(
      { error: `length must be one of: ${VALID_LENGTHS.join(", ")}` },
      { status: 422 }
    );
  }

  try {
    const result = await emailGeneratorService.generate({
      topic: topic.trim(),
      tone: tone as EmailTone,
      length: length as EmailLength,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[generate-email]", err);
    return NextResponse.json(
      { error: "Email generation failed. Please try again." },
      { status: 500 }
    );
  }
}
