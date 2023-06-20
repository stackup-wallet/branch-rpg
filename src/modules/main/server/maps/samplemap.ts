import { RpgMap, MapData } from "@rpgjs/server";
import { GardenEvent } from "../events/garden";
import { InfoEvent } from "../events/info";
import { WaterEvent } from "../events/water";
import { executeEvent } from "../events/execute";

@MapData({
  id: "simplemap",
  file: require("./tmx/simplemap.tmx"),
  name: "Forest",
  events: [GardenEvent, InfoEvent, WaterEvent, executeEvent],
})
export class SampleMap extends RpgMap {}
