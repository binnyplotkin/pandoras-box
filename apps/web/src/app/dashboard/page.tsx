import { auth } from "@/lib/auth";
import { getDashboardWorlds, getDashboardStats, getDashboardActivity } from "@/lib/dashboard-data";
import { DashboardContent } from "@/components/dashboard-content";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const firstName = session?.user?.name?.split(" ")[0] ?? "Explorer";

  const [worlds, stats, activity] = userId
    ? await Promise.all([
        getDashboardWorlds(userId),
        getDashboardStats(userId),
        getDashboardActivity(userId),
      ])
    : [[], { totalWorlds: 0, sessionsPlayed: 0, totalTurns: 0 }, []];

  return (
    <DashboardContent
      firstName={firstName}
      worlds={worlds}
      stats={stats}
      activity={activity}
    />
  );
}
