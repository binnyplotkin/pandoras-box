import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient } from "@odyssey/engine";

type InterviewType =
  | "job-interview"
  | "technical-interview"
  | "case-interview"
  | "startup-pitch"
  | "panel-presentation"
  | "press-interview"
  | "high-stakes-qa";

type Profile = {
  jobType: string;
  interviewType: InterviewType;
  industry: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  interviewerCount: number;
  tone: "supportive" | "balanced" | "aggressive";
  timeLimitMinutes: number;
  company: string | null;
  confidence: number;
  reasoning: string;
  webEnhanced: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function heuristicProfile(query: string): Profile {
  const lower = query.toLowerCase();
  const janeStreet = /jane\s*street|janestreet|jantestreet/.test(lower);
  const technical = janeStreet || /technical|engineer|coding|software|quant|trading|system design/.test(lower);
  const marketing = /marketing|growth|brand|demand gen|product marketing/.test(lower);
  const rokt = /rokt/.test(lower);
  const caseInterview = /case|consulting|mckinsey|bain|bcg/.test(lower);
  const startupPitch = /pitch|investor|fundraise|vc/.test(lower);
  const panel = /panel/.test(lower);
  const press = /press|media/.test(lower);
  const highStakesQa = /high[-\s]?stakes q&a|high[-\s]?stakes qa/.test(lower);

  const interviewType: InterviewType = janeStreet
    ? "technical-interview"
    : caseInterview
      ? "case-interview"
      : startupPitch
        ? "startup-pitch"
        : panel
          ? "panel-presentation"
          : press
            ? "press-interview"
            : highStakesQa
              ? "high-stakes-qa"
              : technical
                ? "technical-interview"
                : "job-interview";

  const difficulty = janeStreet ? 10 : rokt && marketing ? 7 : marketing ? 6 : technical ? 7 : 5;
  const tone = janeStreet ? "aggressive" : difficulty >= 4 ? "balanced" : "balanced";
  const interviewerCount = janeStreet ? 3 : panel ? 3 : 2;
  const timeLimitMinutes = janeStreet ? 300 : technical ? 35 : 30;
  const companyMatch = query.match(/\b(?:at|for)\s+(.+)/i);
  const cleanedCompany = companyMatch?.[1]
    ?.replace(/^(the company|company)\s+/i, "")
    .replace(/[.,;]+$/, "")
    .trim();
  const company = cleanedCompany?.length ? cleanedCompany : null;
  const roleMatch = query.match(/(?:practice|prepare|interview|role|position|candidate|for)\s+(?:for\s+)?([a-z0-9\-\s/]+?)\s+(?:at|for)\s+[a-z0-9.\-\s]+/i);
  const extractedRole = roleMatch?.[1]?.trim();
  const jobLabelBase = janeStreet
    ? "Jane Street Quant Interview Candidate"
    : marketing
      ? "Marketing Interview Candidate"
      : technical
        ? "Technical Interview Candidate"
        : "General Interview Candidate";
  const titledRole = extractedRole
    ? extractedRole
        .split(/\s+/)
        .map((token) => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
        .join(" ")
    : null;
  const jobType = titledRole
    ? company
      ? `${titledRole} at ${company}`
      : titledRole
    : company
      ? `${jobLabelBase} at ${company}`
      : jobLabelBase;

  return {
    jobType,
    interviewType,
    industry: janeStreet ? "Finance" : marketing ? "Marketing" : technical ? "Technology" : "General",
    difficultyLevel: clamp(difficulty, 1, 10) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
    interviewerCount: clamp(interviewerCount, 1, 5),
    tone,
    timeLimitMinutes: clamp(timeLimitMinutes, 15, 300),
    company,
    confidence: 0.45,
    reasoning:
      "Heuristic mapping based on detected role/company intent and interview keywords.",
    webEnhanced: false,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { query?: string };
    const query = body.query?.trim();

    if (!query) {
      return NextResponse.json({ error: "query is required." }, { status: 400 });
    }

    const fallback = heuristicProfile(query);
    const client = getOpenAIClient();

    if (!client) {
      return NextResponse.json({ profile: fallback });
    }

    try {
      const response = await client.responses.create({
        model: "gpt-4.1-mini",
        tools: [{ type: "web_search_preview" as const }],
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text:
                  "You generate interview simulation profiles. Use web search for company/interview context when helpful. Return JSON only.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `Create an interview simulation profile for: "${query}".
Decide interview type, realistic difficulty (1-10), interviewer count, tone, and time limit.
If input is vague, default to general interview at L5.
If company implies harder process, increase difficulty accordingly.
`,
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "interview_profile",
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                jobType: { type: "string" },
                interviewType: {
                  type: "string",
                  enum: [
                    "job-interview",
                    "technical-interview",
                    "case-interview",
                    "startup-pitch",
                    "panel-presentation",
                    "press-interview",
                    "high-stakes-qa",
                  ],
                },
                industry: { type: "string" },
                difficultyLevel: { type: "integer", minimum: 1, maximum: 10 },
                interviewerCount: { type: "integer", minimum: 1, maximum: 5 },
                tone: {
                  type: "string",
                  enum: ["supportive", "balanced", "aggressive"],
                },
                timeLimitMinutes: { type: "integer", minimum: 15, maximum: 300 },
                company: { type: ["string", "null"] },
                confidence: { type: "number", minimum: 0, maximum: 1 },
                reasoning: { type: "string" },
              },
              required: [
                "jobType",
                "interviewType",
                "industry",
                "difficultyLevel",
                "interviewerCount",
                "tone",
                "timeLimitMinutes",
                "company",
                "confidence",
                "reasoning",
              ],
            },
          },
        },
      });

      const parsed = JSON.parse(response.output_text ?? "{}") as Omit<Profile, "webEnhanced">;
      const roleWithCompany = fallback.company
        ? fallback.jobType.toLowerCase().includes(fallback.company.toLowerCase())
          ? fallback.jobType
          : `${fallback.jobType} at ${fallback.company}`
        : fallback.jobType;
      const profile: Profile = {
        ...fallback,
        ...parsed,
        jobType: parsed.jobType?.trim() ? parsed.jobType : roleWithCompany,
        difficultyLevel: clamp(parsed.difficultyLevel ?? fallback.difficultyLevel, 1, 10) as
          | 1
          | 2
          | 3
          | 4
          | 5
          | 6
          | 7
          | 8
          | 9
          | 10,
        interviewerCount: clamp(parsed.interviewerCount ?? fallback.interviewerCount, 1, 5),
        timeLimitMinutes: clamp(parsed.timeLimitMinutes ?? fallback.timeLimitMinutes, 15, 300),
        webEnhanced: true,
      };

      return NextResponse.json({ profile });
    } catch {
      return NextResponse.json({ profile: fallback });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate profile." },
      { status: 500 },
    );
  }
}
