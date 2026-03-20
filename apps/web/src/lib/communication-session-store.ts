import { CommunicationSimulationSession } from "@odyssey/engine";

const globalStore = globalThis as typeof globalThis & {
  __odysseyCommunicationSessions?: Map<string, CommunicationSimulationSession>;
};

if (!globalStore.__odysseyCommunicationSessions) {
  globalStore.__odysseyCommunicationSessions = new Map();
}

export const communicationSessions = globalStore.__odysseyCommunicationSessions;
