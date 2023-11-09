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
  action: "water" | "garden";
}

// 
// >>>>>>> CONTRACT INTERFACE HERE <<<<<<<
// 

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
