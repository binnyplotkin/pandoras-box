import { NextRequest, NextResponse } from "next/server";
import { AudioCommunicationSimulationEngine } from "@odyssey/engine";
import { communicationSessions } from "@/lib/communication-session-store";
import {
  getDomainProgress,
  markSimulationComplete,
} from "@/lib/communication-progress-store";

const engine = new AudioCommunicationSimulationEngine();

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { sessionId?: string; clearSession?: boolean };
    if (!body.sessionId) {
      return NextResponse.json({ error: "sessionId is required." }, { status: 400 });
    }

    const session = communicationSessions.get(body.sessionId);
    if (!session) {
      return NextResponse.json({ error: "Unknown communication session." }, { status: 404 });
    }

    const feedback = engine.finalize(session);
    markSimulationComplete(session.scenario.interviewType);
    const progress = getDomainProgress(session.scenario.interviewType);

    if (body.clearSession !== false) {
      communicationSessions.delete(body.sessionId);
    }

    return NextResponse.json({
      sessionId: body.sessionId,
      turnsCompleted: session.turns.length,
      feedback,
      progress,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate communication feedback." },
      { status: 500 },
    );
  }
}
