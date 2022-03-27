import {InteractionEvent, Point} from "pixi.js";

export function interpolate(start: number, end: number, delta: number) {
    return start + (end - start) * delta;
}

export function calcMouseDirection(e: InteractionEvent): Point {
    let centerX = window.innerWidth / 2,
        centerY = window.innerHeight / 2;

    let dirX = e.data.global.x - centerX,
        dirY = e.data.global.y - centerY;

    let magnitude = 1;

    if (dirX != 0 || dirY != 0) {
        magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
    }

    return new Point(dirX / magnitude, dirY / magnitude);
}