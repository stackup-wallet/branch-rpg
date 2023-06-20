<template>
  <div class="web3-wallet">
    <p>Account</p>
    <p>
      {{ "Implementation: " }}
      <a
        href="https://docs.stackup.sh/docs/useropjs-presets#kernel"
        target="_blank"
        >ZeroDev Kernel (via userop.js)</a
      >
    </p>
    <p>
      {{ "Address: " }}
      <a
        :href="`https://mumbai.polygonscan.com/address/${store.address}`"
        target="_blank"
        >{{ store.address }}</a
      >
    </p>
    <hr />
    <p v-if="store.loading" style="text-align: center">
      Loading (open console for logs)...
    </p>
    <button @click="store.execute" :disabled="store.loading">
      Execute tasks ({{ store.calls.length }} pending)
    </button>
    <button @click="store.reset" :disabled="store.loading">Reset tasks</button>
    <hr />
    <button @click="copySigner">Copy signer (keep this secret!)</button>
    <button @click="openRepo">Go to source code</button>
  </div>
</template>

<script>
import { store } from "../store";

export default {
  name: "web3-wallet",
  inject: ["rpgCurrentPlayer"],
  data() {
    return {
      store,
    };
  },
  mounted() {
    this.store = store;
  },
  methods: {
    copySigner() {
      navigator.clipboard.writeText(store.signer);
    },
    openRepo() {
      window.open("https://github.com/stackup-wallet/branch-rpg");
    },
  },
};
</script>

<style scoped lang="scss">
.web3-wallet {
  width: 500px;
  max-height: fit-content;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;

  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  margin: auto;
  padding: 8px;
  z-index: 70;
}

.web3-cta-btn {
  background-color: #1679ef;
}

.web3-wallet button {
  display: block;
  width: 100%;
  border-radius: 8px;
  padding: 8px;
  font-family: $window-font-family;
}

.web3-wallet a,
p {
  color: white;
  font-family: $window-font-family;
}
</style>
