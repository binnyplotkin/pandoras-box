export { AudioCommunicationSimulationEngine } from "./service";
export { generateCommunicationScenario } from "./scenario-generator";
export { analyzeSpeechTurn } from "./speech-analysis";
export { scoreCommunicationTurn } from "./scoring-engine";
export { scaleDifficulty } from "./difficulty-scaler";
export { buildSimulationFeedbackReport } from "./feedback-engine";
export type {
  CommunicationScenarioType,
  CommunicationScenarioInput,
  CommunicationSimulationSession,
  ProcessCommunicationTurnInput,
  ProcessCommunicationTurnResult,
  ScenarioTone,
  ScoreBreakdown,
  SimulationFeedbackReport,
  SimulationPersona,
  SpeechTurnSignal,
} from "./types";
