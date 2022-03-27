import {Food, foodSizeBonus} from "./food";
import {clamp, getDistance, getRandomPos} from "./utils";

export type Input = {
    x: number,
    y: number
}

export type PlayerStats = {
    id: string,
    x: number,
    y: number,
    size: number
}

export type Players = { [id: string]: Player };

const defaultSize = 30;
const maxSize = 300;
const sizeDifference = 1.1; // Size difference necessary to eat another player

const playerSpeed = 150;

export class Player {
    public static players: Players = {};

    get size(): number {
        return this._size;
    }

    public input: Input;

    private id: string;
    private x: number;
    private y: number;
    private _size: number;

    constructor(id: string, x: number,
                y: number, size: number = defaultSize) {
        this.input = {x: 0, y: 0};
        this.id = id;
        this.x = x;
        this.y = y;
        this._size = size;
    }

    public static updateInputs(
        tickTime: number,
        arenaSize: number
    ) {
        for (let id in Player.players) {
            let player = Player.players[id];
            let input = player.input;

            player.x += input.x * tickTime * playerSpeed;
            player.x = clamp(Player.players[id].x, 0, arenaSize);
            player.y += input.y * tickTime * playerSpeed;
            player.y = clamp(Player.players[id].y, 0, arenaSize);
        }
    }

    public static handleCollisions(
        foods: Food[],
        arenaSize: number
    ) {
        for (let id in Player.players) {
            let player = Player.players[id];

            for (let i = foods.length - 1; i >= 0; i--) {
                let food = foods[i];

                let dist = getDistance(player.x, player.y, food.x, food.y);

                if (dist < player.size + food.size) {
                    player.changeSize(foodSizeBonus);
                    foods.splice(i, 1);
                }
            }

            for (let otherId in Player.players) {
                if (id == otherId) continue;

                let otherPlayer = Player.players[otherId];
                let dist = getDistance(player.x, player.y,
                    otherPlayer.x, otherPlayer.y);

                if (dist < player.size + otherPlayer.size &&
                    player.size > otherPlayer.size * sizeDifference
                ) {
                    player.changeSize(otherPlayer.size);
                    otherPlayer.respawn(arenaSize);
                }
            }
        }
    }

    public static getMsgs(): PlayerStats[] {
        let messages: PlayerStats[] = [];

        for (let id in Player.players) {
            let player = Player.players[id];
            messages.push({
                id: id,
                x: player.x,
                y: player.y,
                size: player.size
            })
        }

        return messages;
    }

    public getMsg(): PlayerStats {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            size: this._size
        };
    }

    public changeSize(added: number) {
        let newSize = this._size + added;
        if (newSize > maxSize) newSize = maxSize;
        this._size = newSize;
    }

    public respawn(arenaSize: number) {
        this._size = defaultSize;
        this.x = getRandomPos(arenaSize);
        this.y = getRandomPos(arenaSize);
    }
}