import { getPersistenceStore, getWorldRepository } from "@pandora/db";
import { RuleBasedEventSelector } from "./event-selector";
import { RollingMemorySummarizer } from "./memory-summarizer";
import { DefaultPolicyGuard } from "./policy-guard";
import { HeuristicStateReducer } from "./state-reducer";
import { TurnProcessor, TurnTraceStep } from "./turn-processor";
import { buildWorldDefinitionFromPrompt } from "./world-builder";
import { StaticWorldLoader } from "./world-loader";
import { createId, isoNow } from "@pandora/utils";
import {
  BuildWorldResponse,
  sessionRecordSchema,
  SessionRecord,
  turnInputSchema,
  visibleWorldSchema,
  VisibleWorld,
  worldBuildRequestSchema,
  worldBuildResponseSchema,
  worldDefinitionSchema,
  WorldDefinition,
} from "@pandora/types";

export function createSimulationService(staticWorlds: WorldDefinition[] = []) {
  const worldLoader = new StaticWorldLoader(staticWorlds);
  const turnProcessor = new TurnProcessor(
    new HeuristicStateReducer(),
    new RuleBasedEventSelector(),
    new RollingMemorySummarizer(),
    new DefaultPolicyGuard(),
  );

  async function listWorlds(): Promise<VisibleWorld[]> {
    const worlds = await getWorldRepository(staticWorlds).listWorlds();
    return worlds.map((world) => visibleWorldSchema.parse(world));
  }

  async function getVisibleWorldById(worldId: string) {
    const world = await worldLoader.getWorld(worldId);

    if (!world) {
      return null;
    }

    return visibleWorldSchema.parse(world);
  }

  async function getWorldDetailById(worldId: string) {
    return getWorldRepository(staticWorlds).getWorldDetail(worldId);
  }

  async function updateWorldDefinition(worldId: string, rawDefinition: unknown) {
    const definition = worldDefinitionSchema.parse({
      ...(rawDefinition as Record<string, unknown>),
      id: worldId,
    });

    return getWorldRepository(staticWorlds).updateWorld({ worldId, definition });
  }

  async function buildWorldFromPrompt(rawInput: unknown): Promise<BuildWorldResponse> {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "World builder strict mode requires DATABASE_URL so generated worlds can be persisted.",
      );
    }

    const { prompt } = worldBuildRequestSchema.parse(rawInput);
    const definition = await buildWorldDefinitionFromPrompt(prompt);
    const record = await getWorldRepository(staticWorlds)
      .createWorldFromDefinition({
        prompt,
        definition,
        status: "published",
      })
      .catch((error: unknown) => {
        const code =
          (error as { code?: string })?.code ??
          (error as { cause?: { code?: string } })?.cause?.code;

        if (code === "42P01") {
          throw new Error("World builder requires the worlds table. Run `npm run db:push` first.");
        }

        throw error;
      });

    const response = worldBuildResponseSchema.parse({
      world: visibleWorldSchema.parse(record.definition),
      worldId: record.id,
      roleId: record.definition.roles[0].id,
      published: true,
    });

    return response;
  }

  async function startSession(worldId: string, roleId: string) {
    const world = await worldLoader.getWorld(worldId);

    if (!world) {
      throw new Error(`Unknown world: ${worldId}`);
    }

    const role = world.roles.find((candidate) => candidate.id === roleId);

    if (!role) {
      throw new Error(`Unknown role: ${roleId}`);
    }

    const timestamp = isoNow();
    const session = sessionRecordSchema.parse({
      id: createId("session"),
      worldId,
      roleId,
      status: "active",
      createdAt: timestamp,
      lastActiveAt: timestamp,
      currentStateVersion: 1,
      state: {
        ...world.initialState,
        turnCount: 0,
        activeEventId: null,
        lastEventIds: [],
      },
    });

    await getPersistenceStore().createSession(session);

    return session;
  }

  async function resumeSession(sessionId: string) {
    return getPersistenceStore().getSession(sessionId);
  }

  async function listRecentSessions() {
    const sessions = await getPersistenceStore().listSessions();

    return sessions.map((session) => ({
      id: session.id,
      worldId: session.worldId,
      roleId: session.roleId,
      status: session.status,
      lastActiveAt: session.lastActiveAt,
      currentStateVersion: session.currentStateVersion,
    }));
  }

  async function processTurn(
    sessionId: string,
    rawInput: unknown,
    options?: { onTextDelta?: (delta: string) => void | Promise<void> },
  ) {
    const input = turnInputSchema.parse(rawInput);
    const store = getPersistenceStore();
    const session = await store.getSession(sessionId);

    if (!session) {
      throw new Error(`Unknown session: ${sessionId}`);
    }

    const world = await worldLoader.getWorld(session.worldId);

    if (!world) {
      throw new Error(`Unknown world: ${session.worldId}`);
    }

    const { session: updatedSession, turn } = await turnProcessor.process(world, session, input);

    if (options?.onTextDelta) {
      const deltas = [
        ...turn.result.narration.map((segment) => segment.text),
        ...turn.result.dialogue.map((segment) => `${segment.speaker}: ${segment.text}`),
      ];

      for (const delta of deltas) {
        await options.onTextDelta(delta);
      }
    }

    await store.updateSession(updatedSession);
    await store.appendTurn(turn);

    return {
      session: updatedSession,
      turn,
    };
  }

  async function getSessionTurns(sessionId: string) {
    return getPersistenceStore().getTurns(sessionId);
  }

  async function traceTurnPipeline(rawInput: unknown) {
    const body = rawInput as {
      worldId?: string;
      roleId?: string;
      text?: string;
      mode?: "text" | "voice";
      clientTimestamp?: string;
    };

    if (!body.worldId || !body.roleId || !body.text?.trim()) {
      throw new Error("worldId, roleId, and text are required.");
    }

    const world = await worldLoader.getWorld(body.worldId);

    if (!world) {
      throw new Error(`Unknown world: ${body.worldId}`);
    }

    const role = world.roles.find((candidate) => candidate.id === body.roleId);

    if (!role) {
      throw new Error(`Unknown role: ${body.roleId}`);
    }

    const timestamp = isoNow();
    const input = turnInputSchema.parse({
      mode: body.mode ?? "text",
      text: body.text,
      clientTimestamp: body.clientTimestamp ?? timestamp,
    });

    const session = sessionRecordSchema.parse({
      id: createId("session"),
      worldId: world.id,
      roleId: role.id,
      status: "active",
      createdAt: timestamp,
      lastActiveAt: timestamp,
      currentStateVersion: 1,
      state: {
        ...world.initialState,
        turnCount: 0,
        activeEventId: null,
        lastEventIds: [],
      },
    });

    const trace: TurnTraceStep[] = [
      {
        id: "request-input",
        label: "Request Input",
        data: {
          worldId: world.id,
          worldTitle: world.title,
          roleId: role.id,
          roleTitle: role.title,
          input,
        },
      },
      {
        id: "session-seed",
        label: "Initial Session Seed",
        data: session,
      },
    ];

    const processed = await turnProcessor.process(world, session, input, (step) => {
      trace.push(step);
    });

    trace.push({
      id: "persistence-preview",
      label: "Persistence Writes (Preview)",
      data: {
        store: process.env.DATABASE_URL ? "neon" : "memory",
        updateSession: processed.session,
        appendTurn: processed.turn,
      },
    });
    trace.push({
      id: "response-envelope",
      label: "API Response Envelope",
      data: processed,
    });

    return {
      meta: {
        worldId: world.id,
        worldTitle: world.title,
        roleId: role.id,
        roleTitle: role.title,
        generationMode: process.env.OPENAI_API_KEY
          ? "openai-with-fallback"
          : "fallback-only",
        persistenceMode: process.env.DATABASE_URL ? "neon" : "memory",
      },
      trace,
    };
  }

  function createIntroResult(session: SessionRecord, world: VisibleWorld) {
    const narratorVoice = world.narratorVoice?.voiceId ?? "alloy";

    return {
      world,
      session,
      intro: {
        transcript: "",
        narration: [
          {
            id: createId("narration"),
            speaker: "narrator" as const,
            text: world.introNarration,
          },
        ],
        dialogue: [],
        uiChoices: [
          "Hold open court",
          "Ask the chancellor for a briefing",
          "Demand the military report",
        ],
        visibleState: {
          politicalStability: session.state.politicalStability,
          publicSentiment: session.state.publicSentiment,
          treasury: session.state.treasury,
          militaryPressure: session.state.militaryPressure,
          factionInfluence: session.state.factionInfluence,
        },
        privateStateVersion: session.currentStateVersion,
        event: null,
        audioDirectives: [
          {
            type: "speak" as const,
            voice: narratorVoice,
            text: world.introNarration,
          },
        ],
      },
    };
  }

  return {
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
  };
}
