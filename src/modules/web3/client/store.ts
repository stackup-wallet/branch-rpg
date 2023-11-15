import { ethers } from "ethers";
import { Presets, ICall, Client, IClient } from "userop";
import { reactive } from "vue";
import abi from "./abi.json";

interface IStore {
  loading: boolean;
  score: string;
  waterBalance: string;
  calls: Array<ICall>;
  address: string;
  signer: string;
  init: (signer: string, socket: any) => void;
  execute: () => void;
  reset: () => void;
}

interface ITaskData {
  action: "water" | "garden" | "execute";
}

// 
// >>>>>>> CONTRACT INTERFACE HERE <<<<<<<
// 

const BranchRPGAddress = "0x20d8aE1faAFc55c8e2f1e86D02a62C79D9A43a73";
const BranchRPGContract = new ethers.Contract(
  BranchRPGAddress,
  abi,
  new ethers.providers.JsonRpcProvider(process.env.NODE_RPC_URL)
);

const onTask = (store: IStore) => (data: ITaskData) => {
  switch (data.action) {
    case "water": {
      const call: ICall = {
        to: BranchRPGAddress,
        value: ethers.constants.Zero,
        data: BranchRPGContract.interface.encodeFunctionData("mint", [
          store.address,
          ethers.constants.WeiPerEther,
        ]),
      };
      store.calls = [...store.calls, call];
      break;
    }

    case "garden": {
      const call: ICall = {
        to: BranchRPGAddress,
        value: ethers.constants.Zero,
        data: BranchRPGContract.interface.encodeFunctionData("burn", [
          ethers.constants.WeiPerEther,
        ]),
      };
      store.calls = [...store.calls, call];
      break;
    }

    case "execute": {
      store.execute();
      break;
    }

    default:
      break;
  }
};

const onScore = (store: IStore) => async () => {
  store.score = ethers.utils.formatEther(await BranchRPGContract.score());
  store.waterBalance = ethers.utils.formatEther(await BranchRPGContract.balanceOf(store.address));
};

let userOpBuilder: Presets.Builder.Kernel;
let client: IClient;
export const store = reactive<IStore>({
  loading: false,
  score: "0",
  waterBalance: "0",
  calls: [],
  address: ethers.constants.AddressZero,
  signer: ethers.constants.HashZero,

  async init(signer, socket) {
    try {
      this.loading = true;

      // 
      // >>>>>>> INITIALIZE USER OPERATION HERE <<<<<<<
      // 

      client = await Client.init(process.env.NODE_RPC_URL || "");

      const paymasterMiddleware = process.env.PAYMASTER_RPC_URL
        ? Presets.Middleware.verifyingPaymaster(process.env.PAYMASTER_RPC_URL, {
          type: "payg",
        })
        : undefined;

        userOpBuilder = await Presets.Builder.Kernel.init(
          new ethers.Wallet(signer),
          process.env.NODE_RPC_URL || "",
          { paymasterMiddleware }
        );

        const score = await BranchRPGContract.score();

        this.score = ethers.utils.formatEther(score);
        this.address = userOpBuilder.getSender();
        this.signer = signer;
        
        const BranchRPCBurnFilter = BranchRPGContract.filters.Transfer(
          null,
          ethers.constants.AddressZero
        );
        BranchRPGContract.on(BranchRPCBurnFilter, onScore(this));
        
        socket.on("task", onTask(this));
 
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  },
  async execute() {
    if (this.calls.length === 0) {
      window.alert(
        "No tasks to execute. Try interacting with the bucket and garden..."
      );
      return;
    } else {
      try {
        this.loading = true;

        // 
        // >>>>>>> EXECUTE USER OPERATION HERE <<<<<<<
        // 

        console.log("Generating UserOperation...");
        const res = await client.sendUserOperation(
          userOpBuilder.executeBatch(this.calls),
          {
            onBuild: (op) => console.log("Signed UserOperation:", op),
          }
        );
        console.log(`UserOpHash: ${res.userOpHash}`);

        console.log("Waiting for transaction...");
        const ev = await res.wait();
        if (ev) {
          console.log(`Transaction hash: ${ev.transactionHash}`);
          console.log(
            `https://mumbai.polygonscan.com/tx/${ev.transactionHash}`
          );
        }

      } catch (error: any) {
        const data = error.body ? JSON.parse(error.body) : undefined;
        if (data?.error?.code == -32521) {
          console.log(
            "Execution error. Your tasks are atomic, make sure you have enough water for each time to tend the garden..."
          );
          console.error(data.error);
        } else if (data.error) {
          console.error(data.error);
        } else {
          console.error(error);
        }
      } finally {
        this.reset();
      }
    }
  },
  reset() {
    this.loading = false;
    this.calls = [];
  },
});
