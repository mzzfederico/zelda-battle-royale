import System from ".";
import Entity from "../Entities";

export default class MovementSystem extends System {
    update(timeframe: number, entities: Entity[]): void {
        entities
            .filter((entity: Entity): boolean => (
                entity.getComponent("position")
                && entity.getComponent("movement")
                && entity.getComponent("collider")
            ))
            .forEach((entity: Entity): void => {
                const { x, y } = entity.getComponent("movement");
                entity.getComponent("collider").updateSafePosition();
                entity.getComponent("position").transformation(x * timeframe, y * timeframe);
                entity.getComponent("movement").multiplySpeed(0.25, 0.25);
            })
    }
}

