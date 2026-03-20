import { ProcessCommunicationTurnInput, SpeechAnalysis } from "./types";

const fillerTerms = ["um", "uh", "like", "you know", "sort of", "kind of", "basically"];

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function countMatches(text: string, terms: string[]) {
  const lowered = text.toLowerCase();
  return terms.reduce((count, term) => count + (lowered.includes(term) ? 1 : 0), 0);
}

export function analyzeSpeechTurn(input: ProcessCommunicationTurnInput): SpeechAnalysis {
  const transcript = input.transcript.trim();
  const words = transcript.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const duration = Math.max(1, input.signal?.durationSeconds ?? Math.ceil(wordCount / 2.3));
  const wpm = (wordCount / duration) * 60;
  const pauses = input.signal?.pauseCount ?? 0;
  const fillerCount = countMatches(transcript, fillerTerms);
  const confidencePenalty = pauses * 4 + fillerCount * 6;
  const hasStructure =
    /first|second|third|because|therefore|so|specifically|for example|in summary/i.test(
      transcript,
    );
  const directnessBoost = /I would|I will|my recommendation|the answer is/i.test(transcript)
    ? 12
    : 0;

  const pacing = clamp(100 - Math.abs(wpm - 135) * 0.8 - pauses * 2);
  const clarity = clamp(72 + (hasStructure ? 12 : 0) - fillerCount * 6);
  const structure = clamp(68 + (hasStructure ? 18 : -8));
  const confidence = clamp(76 - confidencePenalty + directnessBoost);
  const hesitation = clamp(pauses * 14 + fillerCount * 10);
  const responseLength = clamp(100 - Math.abs(wordCount - 70) * 1.2);
  const directness = clamp(62 + directnessBoost - (fillerCount + pauses) * 4);
  const composure = clamp(
    78 -
      (input.signal?.interruptedByPanel ? 10 : 0) -
      pauses * 5 -
      fillerCount * 5 +
      (input.signal?.endDetected ? 6 : 0),
  );

  return {
    clarity,
    structure,
    confidence,
    pacing,
    hesitation,
    fillerWords: fillerCount,
    responseLength,
    directness,
    composure,
  };
}
