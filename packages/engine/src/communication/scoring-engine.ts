import {
  ProcessCommunicationTurnInput,
  ScoreBreakdown,
  SpeechAnalysis,
} from "./types";

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function answerQualityScore(transcript: string) {
  const lower = transcript.toLowerCase();
  const explicitMiss =
    /i don't know|i do not know|not sure|no idea|i can't answer|cannot answer|i have no technical background|i don't have technical background|i dont have technical background/.test(
      lower,
    );
  if (explicitMiss) {
    return 8;
  }

  const hasEvidence = /metric|data|result|impact|revenue|users|retention|latency/i.test(transcript);
  const hasStructure = /first|second|third|because|therefore|for example/i.test(transcript);
  const hasDecision = /I would|my recommendation|I decided|I will/i.test(transcript);
  const weakSubstance = transcript.trim().split(/\s+/).length < 12;
  return clamp(
    45 +
      (hasEvidence ? 20 : 0) +
      (hasStructure ? 20 : 0) +
      (hasDecision ? 15 : 0) -
      (weakSubstance ? 20 : 0),
  );
}

function isExpectedBaselinePrompt(prompt: string) {
  return /why|background|walk me through|opening statement|introduce|attracts you/i.test(
    prompt.toLowerCase(),
  );
}

function adaptabilityScore(transcript: string, priorPrompt: string) {
  if (!priorPrompt) {
    return 65;
  }

  const promptWords = new Set(
    priorPrompt
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 4),
  );
  const lowerTranscript = transcript.toLowerCase();
  let overlap = 0;
  promptWords.forEach((word) => {
    if (lowerTranscript.includes(word)) {
      overlap += 1;
    }
  });

  return clamp(52 + overlap * 10);
}

function persuasionScore(transcript: string) {
  const hasCallToAction = /next step|recommend|proposal|commit|execute|ship|launch/i.test(transcript);
  const hasTradeoffLanguage = /tradeoff|risk|upside|downside|constraint|mitigation/i.test(transcript);
  const hasAudienceSignal = /for the team|for customers|for the business|for users/i.test(transcript);
  return clamp(50 + (hasCallToAction ? 20 : 0) + (hasTradeoffLanguage ? 20 : 0) + (hasAudienceSignal ? 10 : 0));
}

export function scoreCommunicationTurn(params: {
  input: ProcessCommunicationTurnInput;
  analysis: SpeechAnalysis;
  priorPrompt: string;
}): ScoreBreakdown {
  const lower = params.input.transcript.toLowerCase();
  const explicitMiss =
    /i don't know|i do not know|not sure|no idea|i can't answer|cannot answer|i have no technical background|i don't have technical background|i dont have technical background/.test(
      lower,
    );
  const answerQuality = answerQualityScore(params.input.transcript);
  const clarityStructure = clamp((params.analysis.clarity + params.analysis.structure) / 2);
  const confidence = clamp(params.analysis.confidence - (explicitMiss ? 40 : 0));
  const composure = clamp(params.analysis.composure - (explicitMiss ? 25 : 0));
  const adaptability = adaptabilityScore(params.input.transcript, params.priorPrompt);
  const concision = clamp(params.analysis.responseLength - (explicitMiss ? 30 : 0));
  const persuasion = persuasionScore(params.input.transcript);

  const overall = clamp(
    answerQuality * 0.24 +
      clarityStructure * 0.16 +
      confidence * 0.14 +
      composure * 0.14 +
      adaptability * 0.12 +
      concision * 0.1 +
      persuasion * 0.1,
  );

  const baselinePrompt = isExpectedBaselinePrompt(params.priorPrompt);
  if (explicitMiss && baselinePrompt) {
    const forcedLow = 20;
    return {
      answerQuality: Math.min(answerQuality, 10),
      clarityStructure: Math.min(clarityStructure, 20),
      confidence: Math.min(confidence, 15),
      composure: Math.min(composure, 20),
      adaptability: Math.min(adaptability, 25),
      concision: Math.min(concision, 25),
      persuasion: Math.min(persuasion, 10),
      overall: forcedLow,
    };
  }

  return {
    answerQuality,
    clarityStructure,
    confidence,
    composure,
    adaptability,
    concision,
    persuasion,
    overall,
  };
}
