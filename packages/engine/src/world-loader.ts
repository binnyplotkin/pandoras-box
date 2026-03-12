import { WorldLoader } from "./interfaces";
import { getWorldRepository } from "@odyssey/db";
import { WorldDefinition } from "@odyssey/types";

export class StaticWorldLoader implements WorldLoader {
  constructor(private readonly staticWorlds: WorldDefinition[] = []) {}

  async listWorlds() {
    return getWorldRepository(this.staticWorlds).listWorlds();
  }

  async getWorld(worldId: string) {
    return getWorldRepository(this.staticWorlds).getWorldById(worldId);
  }
}
