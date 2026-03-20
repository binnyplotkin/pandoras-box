import { NextRequest, NextResponse } from "next/server";
import { AudioCommunicationSimulationEngine, CommunicationScenarioInput } from "@odyssey/engine";
import { communicationSessions } from "@/lib/communication-session-store";
import { markSimulationStart, getDomainProgress } from "@/lib/communication-progress-store";

const engine = new AudioCommunicationSimulationEngine();

function parseInput(body: Partial<CommunicationScenarioInput>): CommunicationScenarioInput {
  const level = Number(body.difficultyLevel ?? 5);
  const interviewerCount = Number(body.interviewerCount ?? 2);

  return {
    jobType: body.jobType ?? "Product Manager",
    interviewType: body.interviewType ?? "job-interview",
    industry: body.industry ?? "Technology",
    difficultyLevel: Math.max(1, Math.min(10, Math.round(level))) as
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
    interviewerCount: Math.max(1, Math.min(5, Math.round(interviewerCount))),
    tone: body.tone ?? "balanced",
    setting: body.setting,
    goal: body.goal,
    timeLimitMinutes: body.timeLimitMinutes,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<CommunicationScenarioInput>;
    const session = engine.startSession(parseInput(body));
    communicationSessions.set(session.sessionId, session);
    markSimulationStart(session.scenario.interviewType, session.activeDifficulty);

    return NextResponse.json({
      sessionId: session.sessionId,
      scenario: session.scenario,
      currentPrompt: session.currentPrompt,
      activeDifficulty: session.activeDifficulty,
      remainingSeconds: session.remainingSeconds,
      progress: getDomainProgress(session.scenario.interviewType),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create communication scenario." },
      { status: 500 },
    );
  }
}
