import { RpgClient, RpgModule } from "@rpgjs/client";
import { Characters } from "./characters/characters";

@RpgModule<RpgClient>({
  spritesheets: [Characters],
})
export default class RpgClientModuleEngine {}
