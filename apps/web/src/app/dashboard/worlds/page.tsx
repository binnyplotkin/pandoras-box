import { auth } from "@/lib/auth";
import { getMyWorlds, getMyWorldsCounts } from "@/lib/dashboard-data";
import { MyWorldsContent } from "@/components/my-worlds-content";

export default async function MyWorldsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const worlds = userId ? await getMyWorlds(userId) : [];
  const counts = getMyWorldsCounts(worlds);

  return <MyWorldsContent worlds={worlds} counts={counts} />;
}
