import { describe, expect, it } from "vitest";
import { AudioCommunicationSimulationEngine } from "../communication";

describe("AudioCommunicationSimulationEngine", () => {
  it("creates scenario sessions and processes iterative turns", () => {
    const engine = new AudioCommunicationSimulationEngine();
    const session = engine.startSession({
      jobType: "Founding Engineer",
      interviewType: "technical-interview",
      industry: "AI Infrastructure",
      difficultyLevel: 3,
      interviewerCount: 2,
      tone: "balanced",
      timeLimitMinutes: 10,
    });

    expect(session.scenario.personas).toHaveLength(2);
    expect(session.currentPrompt.length).toBeGreaterThan(0);

    const turn1 = engine.processTurn(session, {
      transcript:
        "I would start by setting latency targets, then partition traffic and validate each bottleneck with metrics.",
      signal: {
        durationSeconds: 28,
        startDetected: true,
        endDetected: true,
        pauseCount: 1,
      },
    });

    expect(turn1.latestTurn.score.overall).toBeGreaterThan(0);
    expect(turn1.session.turns).toHaveLength(1);
    expect(turn1.nextPrompt.length).toBeGreaterThan(0);
  });

  it("generates final feedback report", () => {
    const engine = new AudioCommunicationSimulationEngine();
    let session = engine.startSession({
      jobType: "Product Lead",
      interviewType: "panel-presentation",
      industry: "B2B SaaS",
      difficultyLevel: 2,
      interviewerCount: 3,
      tone: "supportive",
      timeLimitMinutes: 8,
    });

    session = engine.processTurn(session, {
      transcript: "My recommendation is to prioritize retention and prove impact in 30 days.",
      signal: { durationSeconds: 24, pauseCount: 0, endDetected: true },
    }).session;
    session = engine.processTurn(session, {
      transcript:
        "The key risk is onboarding friction, so we mitigate with guided setup and weekly success reviews.",
      signal: { durationSeconds: 27, pauseCount: 1, endDetected: true },
    }).session;

    const feedback = engine.finalize(session);

    expect(feedback.overallScore).toBeGreaterThan(0);
    expect(feedback.strengths.length).toBeGreaterThan(0);
    expect(feedback.weaknesses.length).toBeGreaterThan(0);
  });
});
