import {Graphics} from "pixi.js";
import {Socket} from "socket.io-client";

type UpdateFoodMsg = {
    food: Food[]
}

export class Food {
    private static foods: Food[] = [];

    private x: number;
    private y: number;
    private size: number;

    constructor(x: number, y: number, size: number) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    public static registerHandlers(socket: Socket) {
        socket.on("updateFood", (msg: UpdateFoodMsg) => {
            Food.foods = msg.food;
        });
    }

    public static drawFood(offsetX: number, offsetY: number, graphics: Graphics) {
        graphics.beginFill(0xEB6434, 1);

        for (let food of Food.foods) {
            graphics.drawCircle(food.x + offsetX,
                food.y + offsetY, food.size);
        }

        graphics.endFill();
    }
}