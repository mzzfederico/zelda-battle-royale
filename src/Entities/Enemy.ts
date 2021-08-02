
import Entity from "__Core/Entity";

import Collider from "__Components/Collider.Component";
import Health from "__Components/Health.Component";
import Movement from "__Components/Movement.Component";
import Scene from "__Core/Scene";
import Sprite from "__Components/Sprite.Component";
import SpriteAnimation from "__Components/SpriteAnimation.Component";
import handleRigidCollision from "__Utils/handleRigidCollision";
import { roundFloat } from "../../../engine/Utils/rounding";

export default class Enemy extends Entity {
    enemySpeed: number = 0.0015;
    room: number[] = [0, 0];

    constructor({ spawn = { x: 0, y: 0 }, spriteSrc }: IEnemyProps) {
        super({ tag: "enemy", x: spawn.x, y: spawn.y });

        const sprite = new Sprite({ src: spriteSrc, width: 1, height: 1 });
        const health = new Health(3);
        const collider = new Collider({
            width: 1,
            height: 1,
            isRigid: true,
            onCollision: this.handleCollision.bind(this)
        });
        const movement = new Movement({
            x: 0, y: 0,
            onStop: this.handleStop
        });
        this.addComponent(sprite);
        this.addComponent(health);
        this.addComponent(collider);
        this.addComponent(movement);
    }

    handleMovementStart = (direction) => {
        const animation = this.getComponent(SpriteAnimation) as SpriteAnimation;
        if (animation) animation.changeState(`walking_${direction}`);
    }

    handleStop = () => {
        const animation = this.getComponent(SpriteAnimation) as SpriteAnimation;
        if (animation) animation.nextState();
    }

    handleCollision(target: Entity, scene: Scene, direction: number[]) {
        if (target.tag === "player") {
            this.handlePlayerCollision(target, direction);
            return;
        }
        handleRigidCollision(this, target);
    }

    handlePlayerCollision(target: Entity, direction: number[]) {
        const health: Health = (target.getComponent(Health) as Health);
        const movement: Movement = (target.getComponent(Movement) as Movement);

        if (!health.invincibleTime) {
            const [x, y] = direction;
            health.decrementHealth(0.5);
            movement.setSpeed(x * 0.10, y * 0.10);
            health.invincibleTime = 1500;
            return;
        }
    }
}

interface IEnemyProps {
    spriteSrc?: string;
    spawn: {
        x: number;
        y: number;
    }
}