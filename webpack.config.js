/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();
const webpack = require("@rpgjs/compiler");

module.exports = webpack(__dirname, {
  envsClient: ["NODE_RPC_URL", "PAYMASTER_RPC_URL"],
});
