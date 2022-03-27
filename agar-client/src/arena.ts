import {Graphics} from "pixi.js";
import {Socket} from "socket.io-client";

type UpdateArenaSizeMsg = {
    size: number
}

export class Arena {
    private size: number;

    constructor(size: number) {
        this.size = size;
    }

    public registerHandlers(socket: Socket) {
        socket.on("updateArenaSize", (msg: UpdateArenaSizeMsg) => {
            this.size = msg.size;
        });
    }

    public drawArena(offsetX: number, offsetY: number, graphics: Graphics) {
        graphics.beginFill(0xD8E8ED, 1);
        graphics.drawRect(offsetX, offsetY, this.size, this.size);
        graphics.endFill();
    }
}