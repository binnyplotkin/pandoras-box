import { desc, eq, ne, count, ilike, or, and } from "drizzle-orm";
import { getDb, worldsTable, sessionsTable, turnsTable, usersTable } from "@odyssey/db";

export type DashboardWorld = {
  id: string;
  title: string;
  description: string;
  status: "live" | "draft" | "archived";
  sessionCount: number;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
};

export type DashboardStats = {
  totalWorlds: number;
  sessionsPlayed: number;
  totalTurns: number;
};

export type ActivityItem = {
  id: string;
  type: "world_created" | "world_updated" | "session_played";
  worldTitle: string;
  time: string;
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(diff / 604800000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (weeks === 1) return "1 week ago";
  return `${weeks} weeks ago`;
}

function mapWorldStatus(status: string): "live" | "draft" | "archived" {
  if (status === "published") return "live";
  if (status === "draft") return "draft";
  return "archived";
}

export async function getDashboardWorlds(userId: string): Promise<DashboardWorld[]> {
  const db = getDb();
  if (!db) return [];

  try {
    const worlds = await db
      .select({
        id: worldsTable.id,
        title: worldsTable.title,
        prompt: worldsTable.prompt,
        status: worldsTable.status,
        createdAt: worldsTable.createdAt,
        updatedAt: worldsTable.updatedAt,
      })
      .from(worldsTable)
      .where(eq(worldsTable.userId, userId))
      .orderBy(desc(worldsTable.updatedAt))
      .limit(6);

    const worldsWithSessions = await Promise.all(
      worlds.map(async (world) => {
        const [sessionResult] = await db
          .select({ count: count() })
          .from(sessionsTable)
          .where(eq(sessionsTable.worldId, world.id));

        return {
          id: world.id,
          title: world.title,
          description: world.prompt,
          status: mapWorldStatus(world.status),
          sessionCount: sessionResult?.count ?? 0,
          lastActivity: formatRelativeTime(world.updatedAt),
          createdAt: world.createdAt.toISOString(),
          updatedAt: world.updatedAt.toISOString(),
        };
      }),
    );

    return worldsWithSessions;
  } catch {
    return [];
  }
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const db = getDb();
  if (!db) return { totalWorlds: 0, sessionsPlayed: 0, totalTurns: 0 };

  try {
    const [worldCount] = await db
      .select({ count: count() })
      .from(worldsTable)
      .where(eq(worldsTable.userId, userId));

    const [sessionCount] = await db
      .select({ count: count() })
      .from(sessionsTable)
      .where(eq(sessionsTable.userId, userId));

    const turnCountResult = await db
      .select({ count: count() })
      .from(turnsTable)
      .innerJoin(sessionsTable, eq(turnsTable.sessionId, sessionsTable.id))
      .where(eq(sessionsTable.userId, userId));

    return {
      totalWorlds: worldCount?.count ?? 0,
      sessionsPlayed: sessionCount?.count ?? 0,
      totalTurns: turnCountResult[0]?.count ?? 0,
    };
  } catch {
    return { totalWorlds: 0, sessionsPlayed: 0, totalTurns: 0 };
  }
}

export async function getDashboardActivity(userId: string): Promise<ActivityItem[]> {
  const db = getDb();
  if (!db) return [];

  try {
    // Get recent worlds created/updated by this user
    const recentWorlds = await db
      .select({
        id: worldsTable.id,
        title: worldsTable.title,
        createdAt: worldsTable.createdAt,
        updatedAt: worldsTable.updatedAt,
      })
      .from(worldsTable)
      .where(eq(worldsTable.userId, userId))
      .orderBy(desc(worldsTable.updatedAt))
      .limit(10);

    const activities: ActivityItem[] = [];

    for (const world of recentWorlds) {
      // If created and updated are very close, it's a "created" event
      const createdUpdatedDiff = Math.abs(
        world.updatedAt.getTime() - world.createdAt.getTime(),
      );

      if (createdUpdatedDiff < 5000) {
        activities.push({
          id: `created-${world.id}`,
          type: "world_created",
          worldTitle: world.title,
          time: formatRelativeTime(world.createdAt),
        });
      } else {
        activities.push({
          id: `updated-${world.id}`,
          type: "world_updated",
          worldTitle: world.title,
          time: formatRelativeTime(world.updatedAt),
        });
        activities.push({
          id: `created-${world.id}`,
          type: "world_created",
          worldTitle: world.title,
          time: formatRelativeTime(world.createdAt),
        });
      }
    }

    // Get recent sessions
    const recentSessions = await db
      .select({
        id: sessionsTable.id,
        worldId: sessionsTable.worldId,
        lastActiveAt: sessionsTable.lastActiveAt,
      })
      .from(sessionsTable)
      .where(eq(sessionsTable.userId, userId))
      .orderBy(desc(sessionsTable.lastActiveAt))
      .limit(10);

    for (const session of recentSessions) {
      const world = recentWorlds.find((w) => w.id === session.worldId);
      activities.push({
        id: `session-${session.id}`,
        type: "session_played",
        worldTitle: world?.title ?? "Unknown World",
        time: formatRelativeTime(session.lastActiveAt),
      });
    }

    // Sort by recency (parse the relative time strings back... or better, sort before formatting)
    // Since we already have the data sorted from DB, just interleave and take top 8
    return activities.slice(0, 8);
  } catch {
    return [];
  }
}

// ── My Worlds page ──────────────────────────────────────────────────

export async function getMyWorlds(userId: string): Promise<DashboardWorld[]> {
  const db = getDb();
  if (!db) return [];

  try {
    const worlds = await db
      .select({
        id: worldsTable.id,
        title: worldsTable.title,
        prompt: worldsTable.prompt,
        status: worldsTable.status,
        createdAt: worldsTable.createdAt,
        updatedAt: worldsTable.updatedAt,
      })
      .from(worldsTable)
      .where(eq(worldsTable.userId, userId))
      .orderBy(desc(worldsTable.updatedAt));

    const worldsWithSessions = await Promise.all(
      worlds.map(async (world) => {
        const [sessionResult] = await db
          .select({ count: count() })
          .from(sessionsTable)
          .where(eq(sessionsTable.worldId, world.id));

        return {
          id: world.id,
          title: world.title,
          description: world.prompt,
          status: mapWorldStatus(world.status),
          sessionCount: sessionResult?.count ?? 0,
          lastActivity: formatRelativeTime(world.updatedAt),
          createdAt: world.createdAt.toISOString(),
          updatedAt: world.updatedAt.toISOString(),
        };
      }),
    );

    return worldsWithSessions;
  } catch {
    return [];
  }
}

export function getMyWorldsCounts(worlds: DashboardWorld[]) {
  return {
    all: worlds.length,
    live: worlds.filter((w) => w.status === "live").length,
    draft: worlds.filter((w) => w.status === "draft").length,
    archived: worlds.filter((w) => w.status === "archived").length,
  };
}

// ── Explore page ────────────────────────────────────────────────────

export type ExploreWorld = {
  id: string;
  title: string;
  description: string;
  authorName: string;
  authorImage: string | null;
  playCount: number;
  createdAt: string;
};

export async function getExploreWorlds(currentUserId: string): Promise<ExploreWorld[]> {
  const db = getDb();
  if (!db) return [];

  try {
    const worlds = await db
      .select({
        id: worldsTable.id,
        title: worldsTable.title,
        prompt: worldsTable.prompt,
        userId: worldsTable.userId,
        createdAt: worldsTable.createdAt,
        authorName: usersTable.name,
        authorImage: usersTable.image,
      })
      .from(worldsTable)
      .leftJoin(usersTable, eq(worldsTable.userId, usersTable.id))
      .where(
        and(
          eq(worldsTable.status, "published"),
          ne(worldsTable.userId, currentUserId),
        ),
      )
      .orderBy(desc(worldsTable.createdAt))
      .limit(20);

    const worldsWithPlays = await Promise.all(
      worlds.map(async (world) => {
        const [sessionResult] = await db
          .select({ count: count() })
          .from(sessionsTable)
          .where(eq(sessionsTable.worldId, world.id));

        return {
          id: world.id,
          title: world.title,
          description: world.prompt,
          authorName: world.authorName ?? "Unknown",
          authorImage: world.authorImage,
          playCount: sessionResult?.count ?? 0,
          createdAt: world.createdAt.toISOString(),
        };
      }),
    );

    return worldsWithPlays;
  } catch {
    return [];
  }
}

export async function getFeaturedWorld(currentUserId: string): Promise<ExploreWorld | null> {
  const db = getDb();
  if (!db) return null;

  try {
    // Featured = published world with the most sessions (not by current user)
    const worlds = await db
      .select({
        id: worldsTable.id,
        title: worldsTable.title,
        prompt: worldsTable.prompt,
        userId: worldsTable.userId,
        createdAt: worldsTable.createdAt,
        authorName: usersTable.name,
        authorImage: usersTable.image,
      })
      .from(worldsTable)
      .leftJoin(usersTable, eq(worldsTable.userId, usersTable.id))
      .where(
        and(
          eq(worldsTable.status, "published"),
          ne(worldsTable.userId, currentUserId),
        ),
      )
      .orderBy(desc(worldsTable.createdAt))
      .limit(1);

    if (worlds.length === 0) return null;

    const world = worlds[0]!;
    const [sessionResult] = await db
      .select({ count: count() })
      .from(sessionsTable)
      .where(eq(sessionsTable.worldId, world.id));

    return {
      id: world.id,
      title: world.title,
      description: world.prompt,
      authorName: world.authorName ?? "Unknown",
      authorImage: world.authorImage,
      playCount: sessionResult?.count ?? 0,
      createdAt: world.createdAt.toISOString(),
    };
  } catch {
    return null;
  }
}
