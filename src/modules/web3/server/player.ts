import { RpgPlayer, RpgPlayerHooks, Components, Control } from "@rpgjs/server";

export const player: RpgPlayerHooks = {
  onConnected(p: RpgPlayer) {
    p.name = "0x";
    p.setComponentsTop(Components.text("{name}"));
  },

  onInput(p: RpgPlayer, { input }) {
    if (input == Control.Back && !p.getVariable("web3WalletOpen")) {
      p.gui("web3-wallet").open();
      p.setVariable("web3WalletOpen", true);
    } else if (input == Control.Back && p.getVariable("web3WalletOpen")) {
      p.gui("web3-wallet").close();
      p.setVariable("web3WalletOpen", false);
    }
  },

  async onJoinMap(p: RpgPlayer) {
    p.gui("web3-score").open();
    p.once("account", async (acc) => {
      if (typeof acc.address == "string") {
        p.name = acc.address.slice(0, 6);
      }
    });
  },
};
