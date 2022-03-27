import {interpolate} from "./utils";
import {Socket} from "socket.io-client";
import {Graphics, Point} from "pixi.js";

type PlayerStats = {
    id: string,
    x: number,
    y: number,
    size: number
}

type UpdatePlayersMsg = {
    players: PlayerStats[]
}

type PlayerJoinedMsg = {
    player: PlayerStats
}

type PlayerLeftMsg = {
    id: string
}

// Stores the smoothed position of the player (for lag compensation)
type PlayerGFX = {
    x: number,
    y: number
}

export type Players = { [id: string]: Player };

const smoothingSpeed = 2;

export class Player {
    private static players: Players = {};

    get id(): string {
        return this._id;
    }

    public gfx: PlayerGFX;

    private readonly _id: string;

    private x: number;
    private y: number;
    private size: number;

    constructor(id: string, x: number, y: number, size: number) {
        this._id = id;
        this.x = x;
        this.y = y;
        this.size = size;
        this.gfx = {
            x: this.x,
            y: this.y
        };
    }

    public static registerPlayerHandlers(socket: Socket) {
        socket.on("updatePlayers", (msg: UpdatePlayersMsg) => {
            for (let player of msg.players) {
                let id = player.id;

                if (Player.players[id] == undefined) {
                    Player.players[id] = new Player(id, player.x,
                        player.y, player.size);
                    continue;
                }

                Player.players[id].x = player.x;
                Player.players[id].y = player.y;
                Player.players[id].size = player.size;
            }
        });

        socket.on("playerJoined", (msg: PlayerJoinedMsg) => {
            let newPlayer = msg.player;
            Player.players[newPlayer.id] = new Player(newPlayer.id, newPlayer.x,
                newPlayer.y, newPlayer.size);
        });

        socket.on("playerLeft", (msg: PlayerLeftMsg) => {
            delete Player.players[msg.id];
        });
    }

    public static updatePlayers(
        frameTime: number
    ) {
        for (let id in Player.players) {
            /*
             * Move the graphical representation of the player smoothly,
             * so that it will look good on high frame rates or with high
             * latency.
             */
            Player.players[id].gfx.x = interpolate(Player.players[id].gfx.x, Player.players[id].x,
                frameTime * smoothingSpeed);
            Player.players[id].gfx.y = interpolate(Player.players[id].gfx.y, Player.players[id].y,
                frameTime * smoothingSpeed);
        }
    }

    public static drawPlayers(
        offsetX: number,
        offsetY: number,
        graphics: Graphics
    ) {
        graphics.beginFill(0x35CC5A, 1);

        for (let id in Player.players) {
            let player = Player.players[id];

            graphics.drawCircle(player.gfx.x + offsetX,
                player.gfx.y + offsetY, player.size);
        }

        graphics.endFill();
    }

    /*
     * This offset is used to give the effect of a camera
     * following the client's player.
     */
    public static getOffset(localId: string): Point {
        if (Player.players[localId] == undefined) return new Point(0, 0);
        return new Point(window.innerWidth / 2 - Player.players[localId].gfx.x,
            window.innerHeight / 2 - Player.players[localId].gfx.y);
    }
}