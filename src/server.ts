import http from "http";
import express from "express";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import PrettyError from "pretty-error";
import { entryPoint } from "@rpgjs/server";
import globalConfig from "./config/server";
import modules from "./modules";

const PORT = process.env.PORT || 3000;

const pe = new PrettyError();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 1e4,
});

app.use(bodyParser.json());

app.use("/", express.static(__dirname + "/../client"));

server.listen(PORT, async () => {
  const rpgGame = await entryPoint(modules, {
    io,
    basePath: __dirname,
    globalConfig,
  });
  rpgGame.app = app; // Useful for plugins (monitoring, backend, etc.)
  rpgGame.start();
  console.log(`
        ===> MMORPG is running on http://localhost:${PORT} <===
    `);
});

process.on("uncaughtException", function (error) {
  console.log(pe.render(error));
});

process.on("unhandledRejection", function (reason: any) {
  console.log(pe.render(reason));
});
