import System from ".";
import Collider from "../Components/Collider.Component";
import Position from "../Components/Position.Component";
import Entity from "../Entities";

export default class Collision extends System {
    update(time: number, entities: Entity[]): void {
        this.checkCurrentCollisions(entities);
    }

    checkCurrentCollisions(entities: Entity[]): void {
        /* Check only colliders & enabled ones*/
        const entitiesWithCollidors = entities
            .filter((target: Entity) => target.getComponent(Collider) && !target.isDisabled);

        entitiesWithCollidors.forEach(
            (source: Entity) => entitiesWithCollidors
                .filter(target => target.id !== source.id)
                .forEach(target => {
                    const collisionOccurred = this.checkCollision(
                        { collider: source.getComponent(Collider) as Collider, position: source.getComponent(Position) as Position },
                        { collider: target.getComponent(Collider) as Collider, position: target.getComponent(Position) as Position }
                    );

                    if (collisionOccurred) {
                        (source.getComponent(Collider) as Collider).onCollision(target);
                    }
                })
        )
    }

    checkCollision(a: CollisionCheckProps, b: CollisionCheckProps): boolean {
        //if (a.id === "wall") console.log(a, b);
        if (a.position.x < (b.position.x + b.collider.width) &&
            (a.position.x + a.collider.width) > b.position.x &&
            a.position.y < (b.position.y + b.collider.height) &&
            (a.position.y + a.collider.height) > b.position.y) {
            return true;
        }
        return false;
    }
}

type CollisionCheckProps = {
    position: Position;
    collider: Collider;
}