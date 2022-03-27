import express from "express";
import path from "path";
import {Input, Player} from "./player";
import {Food, UpdateFoods} from "./food";
import {getRandomPos} from "./utils";
import * as Http from "http";
import {Server, Socket} from "socket.io";

const port = 8080;

const app = express();
const httpServer = Http.createServer(app);
const io = new Server(httpServer);

const targetTps = 30;
const tickTimeMs = 1000 / targetTps;
const tickTime = targetTps / 1000;

const arenaSize = 3000;

let foods: Food[] = [];

io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    Player.players[socket.id] = new Player(
        socket.id,
        getRandomPos(arenaSize),
        getRandomPos(arenaSize)
    );

    socket.emit("updateArenaSize", {size: arenaSize});
    socket.emit("updatePlayers", {players: Player.getMsgs()});
    socket.broadcast.emit("playerJoined", {player: Player.players[socket.id].getMsg()});

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);

        socket.broadcast.emit("playerLeft", {id: socket.id});
        delete Player.players[socket.id];
    });

    socket.on("updateInput", (updateInputMsg: Input) => {
        Player.players[socket.id].input = updateInputMsg;
    });
});

app.use(
    express.static(path.join(__dirname, "../../agar-client/dist/"))
);

httpServer.listen(port, () => {
    console.log(`Listening on *:${port}`)
});

setInterval(tick, tickTimeMs);

function tick() {
    Player.updateInputs(tickTime, arenaSize);
    Player.handleCollisions(foods, arenaSize);

    io.emit("updatePlayers", {players: Player.getMsgs()});

    UpdateFoods(foods, arenaSize);

    io.emit("updateFood", {food: foods});
}