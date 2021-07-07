import Entity from "./Entities";
import System from "./Systems";

export default class Scene {
    target: HTMLElement;
    entities: Entity[];
    systems: System[];
    lastRender: number;

    constructor(targetId: string, entities: Entity[] = [], systems: System[] = []) {
        this.target = document.getElementById(targetId);
        this.entities = entities;
        this.systems = systems;
        return this;
    }

    addEntity = (newEntity: Entity): void => {
        this.entities.push(newEntity);
    }

    removeEntity = (EntityId: string): void => {
        this.entities.filter(entity => entity.id !== EntityId);
    }


    addSystem = (newSystem: System): void => {
        this.systems.push(newSystem);
    }

    removeSystem = (SystemId: string): void => {
        this.systems.filter(system => system.id !== SystemId);
    }

    update = (progress: number): void => {
        // Update the state of the world for the elapsed time since last render
        //console.log("update");

        this.systems.forEach((system: System) => {
            system.update(progress, this.entities);
        });
    }

    /* draw = (): void => {
        // Draw the state of the world
        //console.log("draw");
    } */

    loop = (timestamp: number): void => {
        const progress: number = timestamp - this.lastRender;

        this.update(progress);
        //this.draw();

        this.lastRender = timestamp;
        window.requestAnimationFrame(this.loop);
    }

    start = (): void => {
        this.systems.forEach((system: System) => {
            system.start(this.entities);
        });

        window.requestAnimationFrame(this.loop);
    }
}