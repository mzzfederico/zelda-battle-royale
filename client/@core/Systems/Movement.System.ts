import System from ".";

export default class MovementSystem extends System {
    update(timeframe, entities) {

        entities
            .filter(entity => (
                entity.getComponent("position")
                && entity.getComponent("movement")
            ))
            .forEach(entity => {
                const { x, y } = entity.getComponent("movement");
                entity.getComponent("collider").updateSafePosition();
                entity.getComponent("position").transformation(
                    x * timeframe,
                    y * timeframe
                );
            })
    }
}