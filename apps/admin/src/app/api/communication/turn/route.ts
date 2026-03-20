import { NextRequest, NextResponse } from "next/server";
import {
  AudioCommunicationSimulationEngine,
  ProcessCommunicationTurnInput,
} from "@odyssey/engine";
import { communicationSessions } from "@/lib/communication-session-store";
import {
  getDomainProgress,
  recordTurnProgress,
} from "@/lib/communication-progress-store";

const engine = new AudioCommunicationSimulationEngine();

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      sessionId?: string;
      transcript?: string;
      signal?: ProcessCommunicationTurnInput["signal"];
    };

    if (!body.sessionId || !body.transcript?.trim()) {
      return NextResponse.json(
        { error: "sessionId and transcript are required." },
        { status: 400 },
      );
    }

    const session = communicationSessions.get(body.sessionId);
    if (!session) {
      return NextResponse.json({ error: "Unknown communication session." }, { status: 404 });
    }

    const result = engine.processTurn(session, {
      transcript: body.transcript,
      signal: body.signal,
    });
    communicationSessions.set(body.sessionId, result.session);
    const relative = recordTurnProgress({
      domain: result.session.scenario.interviewType,
      difficulty: result.session.activeDifficulty,
      answeredCorrectly: result.latestTurn.answeredCorrectly,
      rawOverall: result.latestTurn.score.overall,
    });
    const progress = getDomainProgress(result.session.scenario.interviewType);

    return NextResponse.json({
      sessionId: body.sessionId,
      latestTurn: result.latestTurn,
      nextPrompt: result.nextPrompt,
      shouldEnd: result.shouldEnd,
      liveCoaching: result.liveCoaching,
      scoreDelta: result.scoreDelta,
      relativeToDifficulty: relative,
      activeDifficulty: result.session.activeDifficulty,
      remainingSeconds: result.session.remainingSeconds,
      turnCount: result.session.turns.length,
      correctCount: result.session.turns.filter((turn) => turn.answeredCorrectly).length,
      accuracyRate:
        result.session.turns.length === 0
          ? 0
          : Math.round(
              (result.session.turns.filter((turn) => turn.answeredCorrectly).length /
                result.session.turns.length) *
                100,
            ),
      progress,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process communication turn." },
      { status: 500 },
    );
  }
}
