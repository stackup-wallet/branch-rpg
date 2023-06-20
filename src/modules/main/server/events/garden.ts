import { RpgEvent, EventData, RpgPlayer } from "@rpgjs/server";

@EventData({
  name: "garden",
  hitbox: {
    width: 128,
    height: 64,
  },
})
export class GardenEvent extends RpgEvent {
  async onAction(player: RpgPlayer) {
    const choice = await player.showChoices(
      "Do you want to water the garden?",
      [
        { text: "Add it to your task", value: true },
        { text: "Cancel", value: false },
      ]
    );

    if (choice?.value) {
      player.emit("task", { action: "garden" });
      player.showNotification("Water garden added to task!");
    }
  }
}
