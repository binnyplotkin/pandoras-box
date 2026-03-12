import { WorldLoader } from "./interfaces";
import { getWorldRepository } from "@pandora/db";
import { WorldDefinition } from "@pandora/types";

export class StaticWorldLoader implements WorldLoader {
  constructor(private readonly staticWorlds: WorldDefinition[] = []) {}

  async listWorlds() {
    return getWorldRepository(this.staticWorlds).listWorlds();
  }

  async getWorld(worldId: string) {
    return getWorldRepository(this.staticWorlds).getWorldById(worldId);
  }
}
