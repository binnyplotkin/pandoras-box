import { createId, isoNow } from "@odyssey/utils";
import { chooseNextPrompt, generatePersonaReactions } from "./dialogue-policy-engine";
import { scaleDifficulty } from "./difficulty-scaler";
import { buildSimulationFeedbackReport } from "./feedback-engine";
import { generateCommunicationScenario } from "./scenario-generator";
import { scoreCommunicationTurn } from "./scoring-engine";
import { analyzeSpeechTurn } from "./speech-analysis";
import {
  CommunicationScenarioInput,
  CommunicationSimulationSession,
  ProcessCommunicationTurnInput,
  ProcessCommunicationTurnResult,
  SimulationFeedbackReport,
} from "./types";

function clampDifficulty(level: number): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 {
  return Math.max(1, Math.min(10, Math.round(level))) as
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
}

function openingPrompt(type: CommunicationScenarioInput["interviewType"]) {
  switch (type) {
    case "startup-pitch":
      return "Give us your 60-second opening pitch, including the problem and why now.";
    case "technical-interview":
      return "Start with a concise summary of your most technically complex recent project.";
    case "press-interview":
      return "Give your opening statement in under 45 seconds.";
    default:
      return "Begin with your opening response and core thesis in under 60 seconds.";
  }
}

export class AudioCommunicationSimulationEngine {
  startSession(input: CommunicationScenarioInput): CommunicationSimulationSession {
    const scenario = generateCommunicationScenario(input);
    const now = isoNow();

    return {
      sessionId: createId("comms_session"),
      scenario,
      startedAt: now,
      updatedAt: now,
      remainingSeconds: scenario.timeLimitSeconds,
      activeDifficulty: clampDifficulty(scenario.difficultyLevel),
      currentPrompt: openingPrompt(scenario.interviewType),
      turns: [],
    };
  }

  processTurn(
    session: CommunicationSimulationSession,
    input: ProcessCommunicationTurnInput,
  ): ProcessCommunicationTurnResult {
    if (!input.transcript?.trim()) {
      throw new Error("transcript is required.");
    }

    const analysis = analyzeSpeechTurn(input);
    const score = scoreCommunicationTurn({
      input,
      analysis,
      priorPrompt: session.currentPrompt,
    });
    const difficultyAfter = scaleDifficulty({
      currentLevel: session.activeDifficulty,
      score,
      turnCount: session.turns.length + 1,
    });
    const reactions = generatePersonaReactions({
      personas: session.scenario.personas,
      score,
      difficulty: difficultyAfter,
      transcript: input.transcript,
    });
    const nextPrompt = chooseNextPrompt({
      interviewType: session.scenario.interviewType,
      turnNumber: session.turns.length + 1,
      difficulty: difficultyAfter,
      priorScore: score,
      roleContext: session.scenario.role,
      industry: session.scenario.industry,
    });

    const spent = Math.max(20, input.signal?.durationSeconds ?? 45);
    const turn = {
      turnNumber: session.turns.length + 1,
      prompt: session.currentPrompt,
      transcript: input.transcript,
      analysis,
      score,
      answeredCorrectly: score.overall >= 75,
      difficultyBefore: session.activeDifficulty,
      difficultyAfter,
      personaReactions: reactions,
    };

    const updatedSession: CommunicationSimulationSession = {
      ...session,
      updatedAt: isoNow(),
      activeDifficulty: difficultyAfter,
      remainingSeconds: Math.max(0, session.remainingSeconds - spent),
      currentPrompt: nextPrompt,
      turns: [...session.turns, turn],
    };

    const liveCoaching = [
      analysis.fillerWords > 2 ? "Reduce filler words and pause with intent." : "Keep your delivery crisp.",
      score.concision < 55 ? "Shorten the first sentence and lead with your recommendation." : "Length is on target.",
      score.persuasion < 60 ? "Add one concrete metric or outcome to increase credibility." : "Evidence level is strong.",
    ];

    return {
      session: updatedSession,
      latestTurn: turn,
      nextPrompt,
      shouldEnd: updatedSession.remainingSeconds <= 0 || updatedSession.turns.length >= 12,
      liveCoaching,
      scoreDelta:
        updatedSession.turns.length > 1
          ? turn.score.overall -
            updatedSession.turns[updatedSession.turns.length - 2].score.overall
          : 0,
    };
  }

  finalize(session: CommunicationSimulationSession): SimulationFeedbackReport {
    return buildSimulationFeedbackReport(session.turns);
  }
}
