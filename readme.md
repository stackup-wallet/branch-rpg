![](https://i.imgur.com/1zN8P56.png)

# Getting started

**🎮 [branch-rpg.stackup.sh](https://branch-rpg.stackup.sh/) 🎮**

BranchRPG is an example app to showcase smart account features for a web3 game. It is built on the [ERC-4337 standard](https://github.com/eth-infinitism/account-abstraction/blob/develop/eip/EIPS/eip-4337.md) along with several open source tools:

- Game engine: [RPG JS](https://rpgjs.dev/)
- Contract accounts: [zerodevapp/kernel](https://github.com/zerodevapp/kernel)
- JS SDK: [userop.js](https://github.com/stackup-wallet/userop.js)

> **🚀 Are you building a web3 game and looking for access to hosted account abstraction infrastructure? Check out [stackup.sh](https://www.stackup.sh/)!**

## Game play

By design, this demo is extremely simple. The game state and every action is handled through an [ERC-20 smart contract on Polygon Mumbai](https://mumbai.polygonscan.com/address/0x20d8aE1faAFc55c8e2f1e86D02a62C79D9A43a73). The use of ERC-4337 contract accounts allows us to improve the UX by introducing batched and gas-less transactions.

The aim of the game is simply to:

1. Fetch some water (an ERC-20 mint transaction)
2. Water the garden patch (an ERC-20 burn transaction)
3. Watch the global score increase as more people do the same thing.

**The global score is a state stored on the contract. Which mean the business logic for this game is entirely decentralized.**

## Running an instance

Since the state of the game world is entirely on-chain, you can fork this repo, run a local instance, and make the client your own while still accessing the same score as the Stackup hosted version.

To run a local version:

```bash
# Copy and fill in the env variables.
# NODE_RPC_URL must be enabled to accept ERC-4337 bundler methods.
# PAYMASTER_RPC_URL should follow https://hackmd.io/@stackup/H1oIvV-qi
# Paymaster is optional. If not set, your account will need MATIC for gas.
cp .env.example .env

# RPG JS v3 is only compatible on Node v14.
npm install
npm run dev
```

# License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

# Contact

Feel free to direct any technical related questions to the `dev-hub` channel in the [Stackup Discord](https://discord.gg/VTjJGvMNyW).
