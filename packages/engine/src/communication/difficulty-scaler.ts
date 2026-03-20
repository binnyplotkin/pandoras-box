import { ScoreBreakdown } from "./types";

export function scaleDifficulty(params: {
  currentLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  score: ScoreBreakdown;
  turnCount: number;
}): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 {
  const { currentLevel, score, turnCount } = params;
  if (turnCount < 2) {
    return currentLevel;
  }

  if (score.overall >= 84 && currentLevel < 10) {
    return (currentLevel + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  }

  if (score.overall <= 48 && currentLevel > 1) {
    return (currentLevel - 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  }

  return currentLevel;
}
