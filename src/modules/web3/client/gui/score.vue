<template>
  <div class="web3-score">
    <p
      v-if="store.address == '0x0000000000000000000000000000000000000000'"
      style="text-align: center"
    >
      Loading state...
    </p>
    <p v-else>Global score: {{ store.score }}</p>
  </div>
</template>

<script>
import { ethers } from "ethers";
import { store } from "../store";

export default {
  name: "web3-score",
  data() {
    return {
      store,
    };
  },
  mounted() {
    this.store = store;
  },
};
</script>

<style scoped lang="scss">
.web3-score {
  position: absolute;
  margin-top: auto;
}

.web3-score p {
  color: white;
  font-size: 21px;
  font-weight: bold;
  font-family: $window-font-family;
}
</style>
