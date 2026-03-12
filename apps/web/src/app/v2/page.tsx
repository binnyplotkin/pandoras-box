import { LandingPage } from "@/components/landing-page";
import { listWorlds } from "@/lib/service";

export default async function LandingPageV2() {
  const worlds = await listWorlds();

  return <LandingPage worlds={worlds} />;
}
