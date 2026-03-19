import { auth } from "@/lib/auth";
import { getExploreWorlds, getFeaturedWorld } from "@/lib/dashboard-data";
import { ExploreContent } from "@/components/explore-content";

export default async function ExplorePage() {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  const [worlds, featured] = await Promise.all([
    getExploreWorlds(userId),
    getFeaturedWorld(userId),
  ]);

  return <ExploreContent worlds={worlds} featured={featured} />;
}
