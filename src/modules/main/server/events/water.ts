import { RpgEvent, EventData, RpgPlayer } from "@rpgjs/server";

@EventData({
  name: "water",
  hitbox: {
    width: 32,
    height: 32,
  },
})
export class WaterEvent extends RpgEvent {
  async onAction(player: RpgPlayer) {
    const choice = await player.showChoices(
      "Do you want to fetch some water?",
      [
        { text: "Add it to your task", value: true },
        { text: "Cancel", value: false },
      ]
    );

    if (choice?.value) {
      player.emit("task", { action: "water" });
      player.showNotification("Fetch water added to task!");
    }
  }
}
