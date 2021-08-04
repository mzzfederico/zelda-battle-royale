import System from "__Core/System";
import Movement from "__Components/Movement.Component";
import Position from "__Components/Position.Component";
import EnemyBehaviour, { EnemyStrategies } from "__Components/EnemyBehaviour.Component";
import Entity from "__Core/Entity";
import getVectorToPosition from "__Utils/getVectorToPosition";
import randomPosition from "__Utils/randomPosition";
import Player from "__Entities/Player";
import Enemy from "__Entities/Enemy";
import Health from "__Components/Health.Component";
import { ROOM_HEIGHT, ROOM_WIDTH } from "../constants";
import { Coordinate2d } from "../../../engine/Types/Coordinate2d";

export default class SystemEnemy extends System {
    update(time: number, entities: Entity[]): void {
        const player = entities.find(entity => entity.tag === "player") as Player;
        const playerHealth = player.getComponent(Health) as Health;
        const assertEmemy = entity => entity.tag === "enemy" && !!entity.getComponent(EnemyBehaviour);

        /* Handle health status */
        (entities.filter(entity => !!entity.getComponent(Health)).forEach(
            entity => {
                const health = entity.getComponent(Health) as Health;
                if (!health) return;
                health.invincibleTime = health.invincibleTime > 0 ? Math.floor(health.invincibleTime - time) : 0;
                if (health.value === 0) entity.setDisabled(true);
                /* Handle time without damage */
            }
        ));

        /* Handle weapon entities on melee time */
        if (player.meleeTimeout !== 0) {
            player.meleeTimeout = player.meleeTimeout > 0 ? Math.floor(player.meleeTimeout - time) : 0;
            const meleeWeaponEntity = entities.find(entity => entity.tag === `${player.meleeWeaponTag}/${player.direction}`);
            if (player.meleeTimeout !== 0) {
                meleeWeaponEntity.isDisabled = false;
            } else {
                meleeWeaponEntity.isDisabled = true;
            }
        }

        /* Handle behaviours */
        (entities.filter(assertEmemy) as Enemy[]).forEach(
            (enemy: Enemy) => {
                const enemyBehaviour = enemy.getComponent(EnemyBehaviour) as EnemyBehaviour;

                if (playerHealth.invincibleTime !== 0) return this.reachPosition(enemy);

                if (enemyBehaviour.state === EnemyStrategies.ReachPlayer) {
                    /* Leave him alone if it's out of boundaries */
                    if (this.isTargetOutOfBounds(player.getComponent(Position) as Position)) {
                        this.reachPosition(enemy);
                        return;
                    }

                    this.reachPlayer(enemy, player);
                }

                if (enemyBehaviour.state === EnemyStrategies.AlignWithPlayer) {
                    this.alignWithPlayer(enemy, player);
                }

                if (enemyBehaviour.state === EnemyStrategies.ReachPosition) {
                    this.reachPosition(enemy);
                }
            }
        );
    }

    reachPlayer(enemy: Enemy, player: Player): void {
        const playerPosition = player.getComponent(Position) as Position;
        const enemyPosition = enemy.getComponent(Position) as Position;
        const enemyMovement = enemy.getComponent(Movement) as Movement;

        const [x, y] = this.correctVectorForBoundaries(
            enemyPosition,
            getVectorToPosition(
                enemyPosition,
                playerPosition
            )
        );


        if (this.hasMargin(x, y, 0.9, 0.9)) {
            enemyMovement.addSpeed(
                this.moveSign(x, enemy.enemySpeed),
                this.moveSign(y, enemy.enemySpeed)
            );
            return;
        }
    }

    alignWithPlayer(enemy: Enemy, player: Player): void {
        const playerPosition = player.getComponent(Position) as Position;
        const enemyPosition = enemy.getComponent(Position) as Position;
        const enemyMovement = enemy.getComponent(Movement) as Movement;

        const [x, y] = this.correctVectorForBoundaries(
            enemyPosition,
            getVectorToPosition(
                enemyPosition,
                playerPosition
            )
        );

        if (this.hasMargin(x, y, 1, 1)) {
            if (Math.abs(x) > Math.abs(y)) {
                enemyMovement.addSpeed(0, this.moveSign(y, enemy.enemySpeed));
                return;
            }

            if (Math.abs(x) < Math.abs(y)) {
                enemyMovement.addSpeed(this.moveSign(x, enemy.enemySpeed), 0);
                return;
            }

            enemyMovement.addSpeed(this.moveSign(x, enemy.enemySpeed), 0);
            return;
        }
    }

    reachPosition(enemy: Enemy): void {
        const enemyPosition = enemy.getComponent(Position) as Position;
        const enemyMovement = enemy.getComponent(Movement) as Movement;
        const behaviour = enemy.getComponent(EnemyBehaviour) as EnemyBehaviour;

        if (!behaviour.destination) {
            behaviour.destination = behaviour.destinationQueue.length ? behaviour.destinationQueue.shift() : randomPosition();
            return;
        }

        const [x, y] = getVectorToPosition(enemyPosition, behaviour.destination);

        if (!this.hasMargin(x, y, 0, 0)) {
            const newDestination = behaviour.destinationQueue.shift();
            behaviour.destination = newDestination;
            return;
        }

        enemyMovement.addSpeed(
            this.moveSign(x, enemy.enemySpeed),
            this.moveSign(y, enemy.enemySpeed)
        );
        return;
    }

    /**
     * Returns 0 if the coordinate is 0, else gives the value the same sign
     * @param coordinate Coordinate to be checked
     * @param value Value which sign will be corrected
     * @returns Returns corrected value
     */
    moveSign(coordinate: number, value: number): number {
        if (coordinate === 0) return 0;
        return coordinate > 0 ? value : -value;
    }

    /**
     * Checks if enemy is getting too close to its target
     * @param x Distance x of target
     * @param y Distance y of target
     * @returns whether too close to target
     */
    hasMargin(x: number, y: number, marginX = 1, marginY = 1): boolean {
        return (x > marginX || x < -marginX) || (y > marginY || y < -marginY);
    }

    /**
     * Prevents the enemy from going too far and touch the walls
     * @param targetPosition Position to be reached
     * @param vector Vector to position
     * @returns Vector that is 0 in case the position is out of reach
     */
    correctVectorForBoundaries(targetPosition: Position, vector: number[]): number[] {
        let correctedVector = [...vector];

        if (targetPosition.x < 1) correctedVector[0] = 0;
        if (targetPosition.y < 1) correctedVector[1] = 0;
        if (targetPosition.x > ROOM_WIDTH - 2) correctedVector[0] = 0;
        if (targetPosition.y > ROOM_HEIGHT - 2) correctedVector[1] = 0;

        return correctedVector;
    }

    /**
     * Returns true if target is out of bounds, false if not
     * @param targetPosition Position to be reached
     * @returns Is the target out of bounds?
     */
    isTargetOutOfBounds(targetPosition: Position): boolean {
        if (
            targetPosition.x < 1
            || targetPosition.y < 1
            || targetPosition.x > ROOM_WIDTH - 2
            || targetPosition.y > ROOM_HEIGHT - 2
        ) {
            return true;
        }
        return false;
    }
}