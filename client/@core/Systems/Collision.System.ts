import System from ".";

export default class Collision extends System {
    update(time, entities) {
        this.checkCurrentCollisions(entities);
    }

    checkCurrentCollisions(entities) {
        const collisionsDetected = [];

        const entitiesWithCollidors = entities.filter(target => target.components.collider && !target.isDisabled); /* Check only collidors */

        entitiesWithCollidors.forEach(
            ({ id, components }) => entitiesWithCollidors

                .forEach(target => {
                    const collisionOccurred = this.checkCollision(
                        components,
                        target.components
                    );

                    if (collisionOccurred) {
                        components.collider.onCollision(target);
                    }
                })
        )

        return collisionsDetected;
    }

    checkCollision(a, b) {
        //console.log({ a, b })
        if (a.position.x < (b.position.x + b.collider.width) &&
            (a.position.x + a.collider.width) > b.position.x &&
            a.position.y < (b.position.y + b.collider.height) &&
            (a.position.y + a.collider.height) > b.position.y) {
            return true;
        }
        return false;
    }
}