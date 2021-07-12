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
        const assertEntity = entity => entity.id === EntityId;

        this.systems.forEach((system: System) => {
            system.cleanup(this.entities.find(assertEntity));
        });

        this.entities = this.entities.filter((e) => !assertEntity(e));
    }

    addSystem = (newSystem: System): void => {
        newSystem.registerScene(this);
        this.systems.push(newSystem);
    }
}