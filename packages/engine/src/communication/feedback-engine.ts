import { ScoreBreakdown, SimulationFeedbackReport, SimulationTurnRecord } from "./types";

function aggregateBreakdown(turns: SimulationTurnRecord[]): ScoreBreakdown {
  const totals = turns.reduce(
    (acc, turn) => {
      acc.answerQuality += turn.score.answerQuality;
      acc.clarityStructure += turn.score.clarityStructure;
      acc.confidence += turn.score.confidence;
      acc.composure += turn.score.composure;
      acc.adaptability += turn.score.adaptability;
      acc.concision += turn.score.concision;
      acc.persuasion += turn.score.persuasion;
      acc.overall += turn.score.overall;
      return acc;
    },
    {
      answerQuality: 0,
      clarityStructure: 0,
      confidence: 0,
      composure: 0,
      adaptability: 0,
      concision: 0,
      persuasion: 0,
      overall: 0,
    },
  );

  const divisor = Math.max(1, turns.length);
  return {
    answerQuality: Math.round(totals.answerQuality / divisor),
    clarityStructure: Math.round(totals.clarityStructure / divisor),
    confidence: Math.round(totals.confidence / divisor),
    composure: Math.round(totals.composure / divisor),
    adaptability: Math.round(totals.adaptability / divisor),
    concision: Math.round(totals.concision / divisor),
    persuasion: Math.round(totals.persuasion / divisor),
    overall: Math.round(totals.overall / divisor),
  };
}

function topStrengths(breakdown: ScoreBreakdown) {
  const pairs: Array<[string, number]> = [
    ["Clarity & structure", breakdown.clarityStructure],
    ["Confidence", breakdown.confidence],
    ["Composure", breakdown.composure],
    ["Adaptability", breakdown.adaptability],
    ["Concision", breakdown.concision],
    ["Persuasion", breakdown.persuasion],
  ];
  return pairs
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([label]) => label);
}

function topWeaknesses(breakdown: ScoreBreakdown) {
  const pairs: Array<[string, number]> = [
    ["Answer quality", breakdown.answerQuality],
    ["Clarity & structure", breakdown.clarityStructure],
    ["Confidence", breakdown.confidence],
    ["Composure", breakdown.composure],
    ["Adaptability", breakdown.adaptability],
    ["Concision", breakdown.concision],
    ["Persuasion", breakdown.persuasion],
  ];
  return pairs
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([label]) => label);
}

export function buildSimulationFeedbackReport(
  turns: SimulationTurnRecord[],
): SimulationFeedbackReport {
  const breakdown = aggregateBreakdown(turns);
  const allCorrect = turns.length > 0 && turns.every((turn) => turn.answeredCorrectly);
  const overallScore = allCorrect ? 100 : breakdown.overall;
  const strengths = topStrengths(breakdown).map(
    (item) => `${item}: consistently above your session average.`,
  );
  const weaknesses = topWeaknesses(breakdown).map(
    (item) => `${item}: prioritize this in your next practice round.`,
  );
  const keyMoments = turns.slice(-3).map(
    (turn) =>
      `Turn ${turn.turnNumber}: scored ${turn.score.overall}/100 after prompt "${turn.prompt}"`,
  );

  return {
    overallScore,
    breakdown,
    strengths,
    weaknesses,
    keyMoments,
    improvedAnswerExamples: [
      "Answer in 3 steps: context, decision, measurable impact.",
      "State your recommendation in the first sentence, then justify it with one metric.",
      "Name one risk and one mitigation to show judgment under pressure.",
    ],
    recommendedNextScenario:
      breakdown.overall >= 80
        ? "Increase difficulty by one level and move to panel presentation mode."
        : "Repeat this scenario at current difficulty and focus on weaker categories.",
  };
}
