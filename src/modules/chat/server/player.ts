import { RpgPlayer, RpgPlayerHooks, RpgMap, RpgWorld } from "@rpgjs/server";

function sendMessage(obj: {
  message: string;
  map: RpgMap;
  player?: RpgPlayer;
  type?: string;
}) {
  const { message, map, player, type } = obj;
  const data: any = {
    message,
    date: Date.now(),
    type: type || "player",
  };
  if (player) {
    data.sender = player.id;
  }
  RpgWorld.getPlayersOfMap(map.id).forEach((p) => {
    p.emit("chat-message", data);
  });
}

export const player: RpgPlayerHooks = {
  onJoinMap(p: RpgPlayer, map: RpgMap) {
    sendMessage({
      message: `${p.name} joined this map`,
      map,
      player: p,
      type: "info",
    });
    p.off("chat-message");
    p.on("chat-message", (message) => {
      sendMessage({
        message: `${p.name}: ${message}`,
        map,
        player: p,
      });
    });
  },
  onLeaveMap(p: RpgPlayer, map: RpgMap) {
    sendMessage({
      message: `${p.name} left this map`,
      map,
      player: p,
      type: "info",
    });
  },
};
