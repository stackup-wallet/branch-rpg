import { RpgPlayer, RpgPlayerHooks, Speed } from "@rpgjs/server";

export const player: RpgPlayerHooks = {
  onConnected(p: RpgPlayer) {
    p.setGraphic("male012");
    p.setHitbox(16, 16);
    p.changeMap("simplemap");
    p.speed = Speed.Slow;
  },

  async onJoinMap(p: RpgPlayer) {
    if (p.getVariable("AFTER_INTRO")) {
      return;
    }
    await p.showText(
      "Welcome to branch, a demo web3 game built with ✨smart accounts✨"
    );
    await p.showText("Use W,A,S,D to move around.");
    await p.showText("Press space or enter to interact with the map.");
    await p.showText("Press escape to view your account.");
    await p.showText(
      "To get started, try interacting with the noticeboard behind you..."
    );
    p.setVariable("AFTER_INTRO", true);
  },
};
