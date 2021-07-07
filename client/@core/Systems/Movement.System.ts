import System from ".";
import Collider from "../Components/Collider.Component";
import Movement from "../Components/Movement.Component";
import Entity from "../Entities";

export default class MovementSystem extends System {
    update(timeframe: number, entities: Entity[]): void {
        entities
            .filter((entity: Entity): boolean => (
                !!entity.getComponent("position")
                && !!entity.getComponent("movement")
                && !!entity.getComponent("collider")
            ))
            .forEach((entity: Entity): void => {
                const position: Position = entity.getComponent("position");
                const movement: Movement = entity.getComponent("movement");
                const collider: Collider = entity.getComponent("collider");

                const { x, y } = movement;

                /* Hacky way to notify each component that it is being moved around or not */
                if (movement.isMoving()) {
                    movement.onStart({ x, y });
                } else {
                    movement.onStop();
                }

                const { x: currentX, y: currentY } = position;
                collider.saveSafePosition(currentX, currentY);
                position.transformation(x * timeframe, y * timeframe);
                movement.multiplySpeed(0.25, 0.25);
            })

    }
}

