import { CommunicationSimulationSession } from "@odyssey/engine";

const globalStore = globalThis as typeof globalThis & {
  __odysseyAdminCommunicationSessions?: Map<string, CommunicationSimulationSession>;
};

if (!globalStore.__odysseyAdminCommunicationSessions) {
  globalStore.__odysseyAdminCommunicationSessions = new Map();
}

export const communicationSessions = globalStore.__odysseyAdminCommunicationSessions;
