import System from "__Core/System";
import Movement from "__Components/Movement.Component";
import Position from "__Components/Position.Component";
import Entity from "__Core/Entity";
import getVectorToPosition from "__Utils/getVectorToPosition";
import Enemy from "__Entities/Enemy";
import Health from "../Components/Health.Component";

export default class EnemyAI extends System {
    update(time: number, entities: Entity[]): void {
        const player = entities.find(entity => entity.tag === "player");
        const playerPosition = player.getComponent(Position) as Position;
        const assertEmemy = entity => entity.tag === "enemy";

        /* Handle time without damage */
        const playerHealth = player.getComponent(Health) as Health;
        playerHealth.invincibleTime = playerHealth.invincibleTime > 0 ? Math.floor(playerHealth.invincibleTime - time) : 0;

        (entities.filter(assertEmemy) as Enemy[]).forEach(
            (enemy: Enemy) => {
                const enemyPosition = enemy.getComponent(Position) as Position;
                const enemyMovement = enemy.getComponent(Movement) as Movement;
                const [x, y] = getVectorToPosition(
                    enemyPosition,
                    playerPosition
                );

                if ((x > 1 || x < -1) || (y > 1 || y < -1)) {
                    enemyMovement.addSpeed(
                        x > 0 ? enemy.enemySpeed : -enemy.enemySpeed,
                        y > 0 ? enemy.enemySpeed : -enemy.enemySpeed,
                    );
                }
            }
        );
    }
}