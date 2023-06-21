import { RpgMap, MapData } from "@rpgjs/server";
import { ExecuteEvent } from "../events/execute";
import { GardenEvent } from "../events/garden";
import { InfoEvent } from "../events/info";
import { WaterEvent } from "../events/water";

@MapData({
  id: "simplemap",
  file: require("./tmx/simplemap.tmx"),
  name: "Forest",
  events: [ExecuteEvent, GardenEvent, InfoEvent, WaterEvent],
})
export class SampleMap extends RpgMap {}
