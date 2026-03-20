export type CommunicationScenarioType =
  | "job-interview"
  | "technical-interview"
  | "case-interview"
  | "startup-pitch"
  | "panel-presentation"
  | "press-interview"
  | "high-stakes-qa";

export type PersonaTemperament = "calm" | "aggressive" | "skeptical" | "warm";
export type PersonaObjectionStyle = "interrupting" | "probing" | "passive";
export type PersonaEmotionalTone =
  | "neutral"
  | "supportive"
  | "pressuring"
  | "critical"
  | "adversarial";

export type ScenarioTone = "supportive" | "balanced" | "aggressive";

export type CommunicationScenarioInput = {
  jobType: string;
  interviewType: CommunicationScenarioType;
  industry: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  interviewerCount: number;
  tone: ScenarioTone;
  setting?: string;
  goal?: string;
  timeLimitMinutes?: number;
};

export type SimulationPersona = {
  id: string;
  name: string;
  role: string;
  temperament: PersonaTemperament;
  agenda: string;
  objectionStyle: PersonaObjectionStyle;
  patienceThreshold: number;
  interruptionTendency: number;
  emotionalTone: PersonaEmotionalTone;
};

export type CommunicationScenario = {
  id: string;
  role: string;
  setting: string;
  goal: string;
  timeLimitSeconds: number;
  participantCount: number;
  difficultyLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  interviewType: CommunicationScenarioType;
  industry: string;
  tone: ScenarioTone;
  personas: SimulationPersona[];
};

export type SpeechTurnSignal = {
  startDetected?: boolean;
  endDetected?: boolean;
  durationSeconds?: number;
  pauseCount?: number;
  avgPauseMs?: number;
  interruptedByPanel?: boolean;
  userInterruptedPanel?: boolean;
  transcriptConfidence?: number;
};

export type SpeechAnalysis = {
  clarity: number;
  structure: number;
  confidence: number;
  pacing: number;
  hesitation: number;
  fillerWords: number;
  responseLength: number;
  directness: number;
  composure: number;
};

export type ScoreBreakdown = {
  answerQuality: number;
  clarityStructure: number;
  confidence: number;
  composure: number;
  adaptability: number;
  concision: number;
  persuasion: number;
  overall: number;
};

export type SimulationTurnRecord = {
  turnNumber: number;
  prompt: string;
  transcript: string;
  analysis: SpeechAnalysis;
  score: ScoreBreakdown;
  answeredCorrectly: boolean;
  difficultyBefore: number;
  difficultyAfter: number;
  personaReactions: Array<{
    personaId: string;
    text: string;
    interrupt: boolean;
    expression: "approving" | "neutral" | "skeptical" | "confused" | "critical";
    emotionalImpact: "calming" | "neutral" | "pressuring";
  }>;
};

export type CommunicationSimulationSession = {
  sessionId: string;
  scenario: CommunicationScenario;
  startedAt: string;
  updatedAt: string;
  remainingSeconds: number;
  activeDifficulty: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  currentPrompt: string;
  turns: SimulationTurnRecord[];
};

export type ProcessCommunicationTurnInput = {
  transcript: string;
  signal?: SpeechTurnSignal;
};

export type ProcessCommunicationTurnResult = {
  session: CommunicationSimulationSession;
  latestTurn: SimulationTurnRecord;
  nextPrompt: string;
  shouldEnd: boolean;
  liveCoaching: string[];
  scoreDelta: number;
};

export type SimulationFeedbackReport = {
  overallScore: number;
  breakdown: ScoreBreakdown;
  strengths: string[];
  weaknesses: string[];
  keyMoments: string[];
  improvedAnswerExamples: string[];
  recommendedNextScenario: string;
};
