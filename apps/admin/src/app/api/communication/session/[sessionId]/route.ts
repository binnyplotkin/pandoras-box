import { NextResponse } from "next/server";
import { communicationSessions } from "@/lib/communication-session-store";
import { getDomainProgress } from "@/lib/communication-progress-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const session = communicationSessions.get(sessionId);

  if (!session) {
    return NextResponse.json({ error: "Unknown communication session." }, { status: 404 });
  }

  return NextResponse.json({
    sessionId,
    scenario: session.scenario,
    currentPrompt: session.currentPrompt,
    activeDifficulty: session.activeDifficulty,
    remainingSeconds: session.remainingSeconds,
    turnCount: session.turns.length,
    progress: getDomainProgress(session.scenario.interviewType),
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const session = communicationSessions.get(sessionId);

  if (!session) {
    return NextResponse.json({ error: "Unknown communication session." }, { status: 404 });
  }

  const body = (await request.json()) as { difficultyLevel?: number };
  const level = Number(body.difficultyLevel);

  if (!Number.isFinite(level)) {
    return NextResponse.json({ error: "difficultyLevel is required." }, { status: 400 });
  }

  const normalized = Math.max(1, Math.min(10, Math.round(level))) as
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10;
  const updated = {
    ...session,
    activeDifficulty: normalized,
  };
  communicationSessions.set(sessionId, updated);

  return NextResponse.json({
    sessionId,
    activeDifficulty: updated.activeDifficulty,
  });
}
