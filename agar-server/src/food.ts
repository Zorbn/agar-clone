import {getRandomPos} from "./utils";

export type Food = {
    x: number,
    y: number,
    size: number
}

export const foodAmount = 100;
export const foodSize = 15;
export const foodSizeBonus = 2;

export function UpdateFoods(foods: Food[], arenaSize: number) {
    while (foods.length < foodAmount) {
        foods.push({x: getRandomPos(arenaSize),
            y: getRandomPos(arenaSize), size: foodSize})
    }
}
