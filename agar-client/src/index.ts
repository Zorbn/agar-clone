import {Graphics, InteractionEvent} from "pixi.js";
import {GameApp} from "./gameApp";
import {calcMouseDirection} from "./utils";
import {Player} from "./player";
import {Food} from "./food";
import {Arena} from "./arena";
import {io} from "socket.io-client";

let gameApp = new GameApp(0x808687);
gameApp.registerListeners();

const graphics = new Graphics();
const targetFps = 144;
const frameTimeMs = 1000 / targetFps;
const frameTime = targetFps / 1000;

const socket = io(/* The client is served by the server,
                              so no domain needs to be specified */);

gameApp.stage.addChild(graphics);

let mouseDirX = 0;
let mouseDirY = 0;

gameApp.stage.interactive = true;
gameApp.stage.on("pointermove", (e: InteractionEvent) => {
    let mouseDir = calcMouseDirection(e);
    mouseDirX = mouseDir.x;
    mouseDirY = mouseDir.y;
});

socket.on("connect", () => {
    let arena = new Arena(0);
    let localId = socket.id;

    arena.registerHandlers(socket);
    Player.registerPlayerHandlers(socket);
    Food.registerHandlers(socket);

    // Run the game at an interval fast enough to match the target framerate
    setInterval(frame, frameTimeMs);

    let offsetX = 0;
    let offsetY = 0;

    function frame() {
        update();
        draw();
    }

    function update() {
        // Handle input only if the player is focused on the game
        if (document.hasFocus()) {
            socket.emit("updateInput", {x: mouseDirX, y: mouseDirY});
        }

        Player.updatePlayers(frameTime);

        let offset = Player.getOffset(localId);
        offsetX = offset.x;
        offsetY = offset.y;
    }

    function draw() {
        graphics.clear();

        arena.drawArena(offsetX, offsetY, graphics);
        Food.drawFood(offsetX, offsetY, graphics);
        Player.drawPlayers(offsetX, offsetY, graphics);
    }
});