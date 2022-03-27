export function getRandomPos(arenaSize: number): number {
    return Math.random() * arenaSize;
}

export function clamp(num: number, min: number, max: number) : number {
    if (num < min) return min;
    if (num > max) return max;
    return num;
}

export function getDistance(x1: number, y1: number,
                     x2: number, y2: number): number {
    let xDist = Math.abs(x1 - x2);
    let yDist = Math.abs(y1 - y2);
    return Math.sqrt(xDist * xDist + yDist * yDist);
}