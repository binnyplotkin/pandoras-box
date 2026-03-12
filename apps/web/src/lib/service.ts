import { getWorldDefinitions } from "@/data/worlds";
import { createSimulationService } from "@pandora/engine";

export const {
  listWorlds,
  getVisibleWorldById,
  getWorldDetailById,
  updateWorldDefinition,
  buildWorldFromPrompt,
  startSession,
  resumeSession,
  listRecentSessions,
  processTurn,
  getSessionTurns,
  traceTurnPipeline,
  createIntroResult,
} = createSimulationService(getWorldDefinitions());
