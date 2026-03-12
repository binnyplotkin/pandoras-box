import { LandingPage } from "@/components/landing-page";
import { listWorlds } from "@/lib/service";

export default async function Home() {
  const worlds = await listWorlds();

  return <LandingPage worlds={worlds} />;
}
