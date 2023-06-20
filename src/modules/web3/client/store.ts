import { ethers } from "ethers";
import { Presets, ICall, Client, IClient } from "userop";
import { reactive } from "vue";
import abi from "./abi.json";
import erc20 from "./erc20.json";

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
  action: "water" | "garden";
}


// Branch RPG contract
const BranchRPGAddress = "0x20d8aE1faAFc55c8e2f1e86D02a62C79D9A43a73";
const BranchRPGContract = new ethers.Contract(
  BranchRPGAddress,
  abi,
  new ethers.providers.JsonRpcProvider(process.env.NODE_RPC_URL)
);
const BranchRPCBurnFilter = BranchRPGContract.filters.Transfer(
  null,
  ethers.constants.AddressZero
);

// Water Balance
const WaterTokenABI = erc20;
const WaterTokenAddress = "0x20d8aE1faAFc55c8e2f1e86D02a62C79D9A43a73";
const WaterTokenContract = new ethers.Contract(
  WaterTokenAddress,
  WaterTokenABI,
  new ethers.providers.JsonRpcProvider(process.env.NODE_RPC_URL)
);

// Update the water balance of the current address
const updateWaterBalance = async (store: IStore) => {
  if (store.address !== ethers.constants.AddressZero) {
    const balance = await WaterTokenContract.balanceOf(store.address);
    store.waterBalance = ethers.utils.formatEther(balance);
  }
};


const onScore = (store: IStore) => async () => {
  store.score = ethers.utils.formatEther(await BranchRPGContract.score());
};

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

    default:
      break;
  }
};

let account: Presets.Builder.Kernel;
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

      const paymasterMiddleware = process.env.PAYMASTER_RPC_URL
        ? Presets.Middleware.verifyingPaymaster(process.env.PAYMASTER_RPC_URL, {
            type: "payg",
          })
        : undefined;
      const [a, c, s] = await Promise.all([
        Presets.Builder.Kernel.init(
          new ethers.Wallet(signer),
          process.env.NODE_RPC_URL || "",
          { paymasterMiddleware }
        ),
        Client.init(process.env.NODE_RPC_URL || ""),
        BranchRPGContract.score(),
      ]);
      account = a;
      client = c;
      this.score = ethers.utils.formatEther(s);
      this.address = account.getSender();
      this.signer = signer;
      // Get water balance
      await updateWaterBalance(this);

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
        console.log("Generating UserOperation...");
        const res = await client.sendUserOperation(
          account.executeBatch(this.calls),
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
        await updateWaterBalance(this);
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
