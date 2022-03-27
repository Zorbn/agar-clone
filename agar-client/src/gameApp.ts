import {Application} from "pixi.js";

export class GameApp extends Application {
    constructor(backgroundColor: number) {
        super({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor
        });
        document.body.appendChild(this.view);
    }

    public registerListeners() {
        window.addEventListener("resize", () => {
            this.renderer.resize(window.innerWidth, window.innerHeight);
        });
    }
}