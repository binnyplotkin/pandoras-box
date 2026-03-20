import { getWorldDefinitions } from "@/data/worlds";
import { createSimulationService } from "@odyssey/engine";

export const {
  listWorlds,
  getVisibleWorldById,
  getWorldDetailById,
  updateWorldDefinition,
  buildWorldFromPrompt,
  startSession,
  resumeSession,
  processTurn,
  createIntroResult,
  traceTurnPipeline,
} = createSimulationService(getWorldDefinitions());
