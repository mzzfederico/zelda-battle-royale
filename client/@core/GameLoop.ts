import Scene from "./Scene";
import System from "./Systems";

export default class GameLoop {
    lastRender: number;
    scenes: Scene[];

    currentScene: Scene;

    constructor(scenes: Scene[] = [], initialScene: Scene = scenes[0]) {
        this.lastRender = 0;
        this.scenes = scenes;
        this.currentScene = initialScene;
    }

    update = (progress: number = 0): void => {
        this.currentScene.systems.forEach((system: System) => {
            system.update(progress, this.currentScene.entities);
        });
    }

    end = () => {
        this.currentScene.systems.forEach((system: System) => {
            system.end(this.currentScene.entities);
        });
    }

    loop = (timestamp: number = 0): void => {
        const progress: number = timestamp - this.lastRender;

        this.update(progress);

        this.lastRender = timestamp;
        window.requestAnimationFrame(this.loop);
    }

    start = (): void => {
        this.currentScene.systems.forEach((system: System) => {
            system.start(this.currentScene.entities);
        });

        window.requestAnimationFrame(this.loop);
    }
}