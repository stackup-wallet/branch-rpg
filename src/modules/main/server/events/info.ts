import { RpgEvent, EventData, RpgPlayer } from "@rpgjs/server";

@EventData({
  name: "info",
  hitbox: {
    width: 64,
    height: 64,
  },
})
export class InfoEvent extends RpgEvent {
  async onAction(player: RpgPlayer) {
    await player.showText("This game has only two objectives...", {
      talkWith: this,
    });
    await player.showText("1. Fetch some water from the bucket.", {
      talkWith: this,
    });
    await player.showText("2. Water the garden patch.", {
      talkWith: this,
    });
    await player.showText(
      "When you're ready, execute your actions through the account menu.",
      {
        talkWith: this,
      }
    );
    await player.showText(
      "Everything is on-chain. But thanks to ✨account abstraction✨ you'll hardly notice the blockchain at all.",
      {
        talkWith: this,
      }
    );
  }
}
