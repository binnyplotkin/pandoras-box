type DomainKey =
  | "job-interview"
  | "technical-interview"
  | "case-interview"
  | "startup-pitch"
  | "panel-presentation"
  | "press-interview"
  | "high-stakes-qa";

type DomainProgress = {
  sessionsStarted: number;
  sessionsCompleted: number;
  questionsAttempted: number;
  questionsCorrect: number;
  totalRelativeScore: number;
  bestRelativeScore: number;
  avgRelativeScore: number;
  lastDifficulty: number;
  lastUpdatedAt: string;
};

type ProfileState = {
  byDomain: Record<DomainKey, DomainProgress>;
};

const defaultDomain = (): DomainProgress => ({
  sessionsStarted: 0,
  sessionsCompleted: 0,
  questionsAttempted: 0,
  questionsCorrect: 0,
  totalRelativeScore: 0,
  bestRelativeScore: 0,
  avgRelativeScore: 0,
  lastDifficulty: 5,
  lastUpdatedAt: new Date().toISOString(),
});

const globalStore = globalThis as typeof globalThis & {
  __odysseyCommunicationProgressStore?: ProfileState;
};

if (!globalStore.__odysseyCommunicationProgressStore) {
  globalStore.__odysseyCommunicationProgressStore = {
    byDomain: {
      "job-interview": defaultDomain(),
      "technical-interview": defaultDomain(),
      "case-interview": defaultDomain(),
      "startup-pitch": defaultDomain(),
      "panel-presentation": defaultDomain(),
      "press-interview": defaultDomain(),
      "high-stakes-qa": defaultDomain(),
    },
  };
}

const store = globalStore.__odysseyCommunicationProgressStore;

function targetByDifficulty(level: number) {
  switch (Math.max(1, Math.min(10, Math.round(level)))) {
    case 1:
      return 52;
    case 2:
      return 57;
    case 3:
      return 62;
    case 4:
      return 67;
    case 5:
      return 72;
    case 6:
      return 76;
    case 7:
      return 80;
    case 8:
      return 84;
    case 9:
      return 88;
    case 10:
    default:
      return 92;
  }
}

export function toDifficultyRelativeScore(rawOverall: number, difficulty: number) {
  const target = targetByDifficulty(difficulty);
  const relative = Math.max(0, Math.min(100, Math.round(50 + (rawOverall - target) * 1.5)));
  const status =
    rawOverall >= target + 5
      ? "exceeding"
      : rawOverall >= target - 5
        ? "on-track"
        : "below-target";
  return {
    relativeScore: relative,
    targetScore: target,
    status,
  } as const;
}

export function markSimulationStart(domain: DomainKey, difficulty: number) {
  const entry = store.byDomain[domain];
  entry.sessionsStarted += 1;
  entry.lastDifficulty = difficulty;
  entry.lastUpdatedAt = new Date().toISOString();
}

export function recordTurnProgress(params: {
  domain: DomainKey;
  difficulty: number;
  answeredCorrectly: boolean;
  rawOverall: number;
}) {
  const entry = store.byDomain[params.domain];
  const relative = toDifficultyRelativeScore(params.rawOverall, params.difficulty);

  entry.questionsAttempted += 1;
  if (params.answeredCorrectly) {
    entry.questionsCorrect += 1;
  }
  entry.totalRelativeScore += relative.relativeScore;
  entry.avgRelativeScore = Math.round(entry.totalRelativeScore / entry.questionsAttempted);
  entry.bestRelativeScore = Math.max(entry.bestRelativeScore, relative.relativeScore);
  entry.lastDifficulty = params.difficulty;
  entry.lastUpdatedAt = new Date().toISOString();

  return relative;
}

export function markSimulationComplete(domain: DomainKey) {
  const entry = store.byDomain[domain];
  entry.sessionsCompleted += 1;
  entry.lastUpdatedAt = new Date().toISOString();
}

export function getDomainProgress(domain: DomainKey) {
  const entry = store.byDomain[domain];
  return {
    ...entry,
    accuracyRate:
      entry.questionsAttempted === 0
        ? 0
        : Math.round((entry.questionsCorrect / entry.questionsAttempted) * 100),
  };
}
