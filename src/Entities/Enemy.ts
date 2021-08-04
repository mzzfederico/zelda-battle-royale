
import Entity from "__Core/Entity";

import Collider from "__Components/Collider.Component";
import Health from "__Components/Health.Component";
import Movement from "__Components/Movement.Component";
import Scene from "__Core/Scene";
import Sprite from "__Components/Sprite.Component";
import SpriteAnimation, { SpriteAnimationState } from "__Components/SpriteAnimation.Component";
import EnemyBehaviour, { EnemyStrategies } from "../Components/EnemyBehaviour.Component";
import handleRigidCollision from "__Utils/handleRigidCollision";
import { roundFloat } from "../../../engine/Utils/rounding";
import { Coordinate2d } from "../../../engine/Types/Coordinate2d";

export default class Enemy extends Entity {
    enemySpeed: number = 0.0015;
    enemyDamage: number = 0.5;
    room: number[] = [0, 0];

    constructor({
        spawn,
        spriteSrc = "",
        animations,
        height = 1,
        width = 1,
        initialAnimation = Array.isArray(animations) && animations.length > 0
            ? animations[0].name : ""
    }: IEnemyProps) {
        super({ tag: "enemy", x: spawn.x, y: spawn.y });

        const sprite = new Sprite({ src: spriteSrc, width, height });
        this.addComponent(sprite);

        if (animations) {
            const animation = new SpriteAnimation(animations, initialAnimation);
            this.addComponent(animation);
        }

        const health = new Health(3);
        const collider = new Collider({
            height,
            width,
            isRigid: true,
            onCollision: this.handleCollision.bind(this)
        });
        const movement = new Movement({
            x: 0, y: 0,
            onStop: this.handleStop
        });
        const enemyBehaviour = new EnemyBehaviour(EnemyStrategies.ReachPlayer, []);

        this.addComponent(health);
        this.addComponent(collider);
        this.addComponent(movement);
        this.addComponent(enemyBehaviour);
    }

    handleMovementStart = (direction) => {
        const animation = this.getComponent(SpriteAnimation) as SpriteAnimation;
        if (animation) animation.changeState(`walking_${direction}`);
    }

    handleStop = () => {
        const animation = this.getComponent(SpriteAnimation) as SpriteAnimation;
        if (animation) animation.nextState();
    }

    handleCollision(target: Entity, colliderTag: string, direction: Coordinate2d): void {
        if (colliderTag === "player") {
            this.handlePlayerCollision(target, direction);
            return;
        }
        handleRigidCollision(this, target);
    }

    handlePlayerCollision(target: Entity, direction: Coordinate2d) {
        const health: Health = (target.getComponent(Health) as Health);
        const movement: Movement = (target.getComponent(Movement) as Movement);

        if (!health.invincibleTime) {
            const { x, y } = direction;
            health.decrementHealth(this.enemyDamage);
            movement.setSpeed(x * 0.10, y * 0.10);
            health.invincibleTime = 1500;
            return;
        }
    }
}

interface IEnemyProps {
    height?: number;
    width?: number;
    spriteSrc?: string;
    initialAnimation?: string;
    animations?: Array<SpriteAnimationState>;
    spawn: {
        x: number;
        y: number;
    }
}