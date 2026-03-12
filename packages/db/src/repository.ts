import { desc, eq } from "drizzle-orm";
import { getDb } from "./client";
import { worldsTable } from "./schema";
import { isoNow } from "@odyssey/utils";
import { WorldDefinition, worldRecordSchema, WorldRecord } from "@odyssey/types";

export type WorldSource = "static" | "dynamic";

export type WorldDetail = {
  source: WorldSource;
  editable: boolean;
  world: WorldDefinition;
  record: WorldRecord | null;
};

export interface WorldRepository {
  listWorlds(): Promise<WorldDefinition[]>;
  getWorldById(worldId: string): Promise<WorldDefinition | null>;
  getWorldDetail(worldId: string): Promise<WorldDetail | null>;
  createWorldFromDefinition(input: {
    prompt: string;
    definition: WorldDefinition;
    status?: "published" | "draft";
  }): Promise<WorldRecord>;
  updateWorld(input: { worldId: string; definition: WorldDefinition }): Promise<WorldRecord | null>;
}

type WorldStoreState = {
  worlds: Map<string, WorldRecord>;
};

const globalWorldStore = globalThis as typeof globalThis & {
  __odysseyWorldStore?: WorldStoreState;
};

const memoryWorldStore =
  globalWorldStore.__odysseyWorldStore ??
  (globalWorldStore.__odysseyWorldStore = {
    worlds: new Map(),
  });

function mergeWorlds(staticWorlds: WorldDefinition[], dynamicWorlds: WorldDefinition[]) {
  const merged = new Map<string, WorldDefinition>();

  staticWorlds.forEach((world) => {
    merged.set(world.id, world);
  });

  dynamicWorlds.forEach((world) => {
    merged.set(world.id, world);
  });

  return Array.from(merged.values());
}

function getStaticWorld(staticWorlds: WorldDefinition[], worldId: string) {
  return staticWorlds.find((world) => world.id === worldId) ?? null;
}

function parseWorldRow(row: {
  id: string;
  title: string;
  prompt: string;
  status: string;
  definition: unknown;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}) {
  return worldRecordSchema.parse({
    id: row.id,
    title: row.title,
    prompt: row.prompt,
    status: row.status,
    definition: row.definition,
    version: row.version,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

function isMissingWorldsTableError(error: unknown) {
  const code =
    (error as { code?: string })?.code ??
    (error as { cause?: { code?: string } })?.cause?.code;

  return code === "42P01";
}

class MemoryWorldRepository implements WorldRepository {
  constructor(private readonly staticWorlds: WorldDefinition[]) {}

  async listWorlds() {
    const dynamicWorlds = Array.from(memoryWorldStore.worlds.values()).map(
      (record) => record.definition,
    );

    return mergeWorlds(this.staticWorlds, dynamicWorlds);
  }

  async getWorldById(worldId: string) {
    const dynamic = memoryWorldStore.worlds.get(worldId);

    if (dynamic) {
      return dynamic.definition;
    }

    return getStaticWorld(this.staticWorlds, worldId);
  }

  async getWorldDetail(worldId: string) {
    const dynamic = memoryWorldStore.worlds.get(worldId);

    if (dynamic) {
      return {
        source: "dynamic" as const,
        editable: true,
        world: dynamic.definition,
        record: dynamic,
      };
    }

    const staticWorld = getStaticWorld(this.staticWorlds, worldId);

    if (!staticWorld) {
      return null;
    }

    return {
      source: "static" as const,
      editable: false,
      world: staticWorld,
      record: null,
    };
  }

  async createWorldFromDefinition({ prompt, definition, status = "published" }: {
    prompt: string;
    definition: WorldDefinition;
    status?: "published" | "draft";
  }) {
    const timestamp = isoNow();
    const record = worldRecordSchema.parse({
      id: definition.id,
      title: definition.title,
      prompt,
      status,
      definition,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    memoryWorldStore.worlds.set(record.id, record);

    return record;
  }

  async updateWorld({ worldId, definition }: { worldId: string; definition: WorldDefinition }) {
    const existing = memoryWorldStore.worlds.get(worldId);

    if (!existing) {
      return null;
    }

    const record = worldRecordSchema.parse({
      ...existing,
      id: worldId,
      title: definition.title,
      definition,
      version: existing.version + 1,
      updatedAt: isoNow(),
    });

    memoryWorldStore.worlds.set(worldId, record);

    return record;
  }
}

class NeonWorldRepository implements WorldRepository {
  private db = getDb();
  private memoryFallback: MemoryWorldRepository;

  constructor(private readonly staticWorlds: WorldDefinition[]) {
    this.memoryFallback = new MemoryWorldRepository(staticWorlds);
  }

  async listWorlds() {
    if (!this.db) {
      return mergeWorlds(this.staticWorlds, []);
    }

    try {
      const rows = await this.db
        .select()
        .from(worldsTable)
        .where(eq(worldsTable.status, "published"))
        .orderBy(desc(worldsTable.updatedAt));

      const dynamicWorlds = rows.map((row) => parseWorldRow(row).definition);

      return mergeWorlds(this.staticWorlds, dynamicWorlds);
    } catch (error) {
      if (isMissingWorldsTableError(error)) {
        return this.memoryFallback.listWorlds();
      }

      throw error;
    }
  }

  async getWorldById(worldId: string) {
    if (!this.db) {
      return getStaticWorld(this.staticWorlds, worldId);
    }

    try {
      const rows = await this.db
        .select()
        .from(worldsTable)
        .where(eq(worldsTable.id, worldId))
        .limit(1);

      const row = rows[0];

      if (row) {
        return parseWorldRow(row).definition;
      }

      return getStaticWorld(this.staticWorlds, worldId);
    } catch (error) {
      if (isMissingWorldsTableError(error)) {
        return this.memoryFallback.getWorldById(worldId);
      }

      throw error;
    }
  }

  async getWorldDetail(worldId: string) {
    if (!this.db) {
      const world = getStaticWorld(this.staticWorlds, worldId);

      if (!world) {
        return null;
      }

      return {
        source: "static" as const,
        editable: false,
        world,
        record: null,
      };
    }

    try {
      const rows = await this.db
        .select()
        .from(worldsTable)
        .where(eq(worldsTable.id, worldId))
        .limit(1);

      const row = rows[0];

      if (row) {
        const record = parseWorldRow(row);

        return {
          source: "dynamic" as const,
          editable: true,
          world: record.definition,
          record,
        };
      }

      const staticWorld = getStaticWorld(this.staticWorlds, worldId);

      if (!staticWorld) {
        return null;
      }

      return {
        source: "static" as const,
        editable: false,
        world: staticWorld,
        record: null,
      };
    } catch (error) {
      if (isMissingWorldsTableError(error)) {
        return this.memoryFallback.getWorldDetail(worldId);
      }

      throw error;
    }
  }

  async createWorldFromDefinition({ prompt, definition, status = "published" }: {
    prompt: string;
    definition: WorldDefinition;
    status?: "published" | "draft";
  }) {
    if (!this.db) {
      throw new Error("Neon database unavailable.");
    }

    const now = new Date();

    await this.db.insert(worldsTable).values({
      id: definition.id,
      title: definition.title,
      prompt,
      status,
      definition,
      version: 1,
      createdAt: now,
      updatedAt: now,
    });

    return worldRecordSchema.parse({
      id: definition.id,
      title: definition.title,
      prompt,
      status,
      definition,
      version: 1,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
  }

  async updateWorld({ worldId, definition }: { worldId: string; definition: WorldDefinition }) {
    if (!this.db) {
      throw new Error("Neon database unavailable.");
    }

    const existingRows = await this.db
      .select()
      .from(worldsTable)
      .where(eq(worldsTable.id, worldId))
      .limit(1);

    const existing = existingRows[0];

    if (!existing) {
      return null;
    }

    const nextVersion = existing.version + 1;
    const updatedAt = new Date();

    await this.db
      .update(worldsTable)
      .set({
        title: definition.title,
        definition,
        version: nextVersion,
        updatedAt,
      })
      .where(eq(worldsTable.id, worldId));

    return worldRecordSchema.parse({
      id: existing.id,
      title: definition.title,
      prompt: existing.prompt,
      status: existing.status,
      definition,
      version: nextVersion,
      createdAt: existing.createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
  }
}

export function getWorldRepository(staticWorlds: WorldDefinition[] = []): WorldRepository {
  return process.env.DATABASE_URL
    ? new NeonWorldRepository(staticWorlds)
    : new MemoryWorldRepository(staticWorlds);
}
