import System from ".";
import Collider from "../Components/Collider.Component";
import Movement from "../Components/Movement.Component";
import Position from "../Components/Position.Component";
import Entity from "../Entities";

export default class MovementSystem extends System {
    update(timeframe: number = 0, entities: Entity[]): void {
        entities
            .filter((entity: Entity): boolean => (
                !!entity.getComponent(Position)
                && !!entity.getComponent(Movement)
                && !!entity.getComponent(Collider)
            ))
            .forEach((entity: Entity): void => {
                const position = entity.getComponent(Position) as Position;
                const movement = entity.getComponent(Movement) as Movement;
                const collider = entity.getComponent(Collider) as Collider;

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

