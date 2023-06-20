import { RpgClientEngine } from "@rpgjs/client";
import { RpgWorld, RpgPlayer } from "@rpgjs/server";
import { testing, clear } from "@rpgjs/testing";
import defaultGui from "@rpgjs/default-gui";
import main from "../src/modules/main";

let player: RpgPlayer;
let client: RpgClientEngine;
let playerId: string;

beforeEach(async () => {
  const fixture = await testing([main, defaultGui], {
    basePath: __dirname + "/../",
  });
  const clientFixture = await fixture.createClient();
  client = clientFixture.client;
  playerId = clientFixture.playerId;
  player = RpgWorld.getPlayer(playerId);
});

test("test player", () => {
  expect(player).toBeDefined(); // player, server side
  expect(client).toBeDefined(); // player, client side
});

afterEach(() => {
  clear();
});
