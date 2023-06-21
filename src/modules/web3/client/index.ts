import { RpgClient, RpgModule } from "@rpgjs/client";
import { ethers } from "ethers";
import { store } from "./store";
import score from "./gui/score.vue";
import wallet from "./gui/wallet.vue";

const findOrCreateSigner = () => {
  let signer = localStorage.getItem("signer");
  if (!signer) {
    signer = ethers.utils.hexlify(ethers.utils.randomBytes(32));
    localStorage.setItem("signer", signer);
  }

  return signer;
};

@RpgModule<RpgClient>({
  gui: [score, wallet],
  engine: {
    async onConnected(_engine, socket) {
      await store.init(findOrCreateSigner(), socket);
      socket.emit("account", { address: store.address });
    },
  },
})
export default class RpgClientModuleEngine {}
