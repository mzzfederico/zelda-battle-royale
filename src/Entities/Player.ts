
import Entity from "__Core/Entity";

import Link_1 from "../Sprites/Link/1.png";
import Link_2 from "../Sprites/Link/2.png";
import Link_3 from "../Sprites/Link/3.png";
import Link_4 from "../Sprites/Link/4.png";
import Link_5 from "../Sprites/Link/5.png";
import Link_6 from "../Sprites/Link/6.png";
import Link_7 from "../Sprites/Link/7.png";
import Link_8 from "../Sprites/Link/8.png";

import Sprite from "__Components/Sprite.Component";
import Health from "__Components/Health.Component";
import Coins from "__Components/Coins.Component";
import Collider from "__Components/Collider.Component";
import ColliderGroup from "__Components/ColliderGroup.Component";
import Input from "__Components/Input.Component";
import Movement from "__Components/Movement.Component";
import SpriteAnimation from "__Components/SpriteAnimation.Component";
import handleRigidCollision from "__Utils/handleRigidCollision";
import { Coordinate2d } from "__Types/Coordinate2d";

export default class Player extends Entity {
    facingDirection: PlayerDirection = PlayerDirection.s;
    playerSpeed: number = 0.0035;
    room: number[] = [0, 0];

    constructor({ spawn = { x: 0, y: 0 } }: IPlayerProps) {
        super({ tag: "player", x: spawn.x, y: spawn.y });

        const sprite = new Sprite({ src: Link_1, width: 1, height: 1 });
        const health = new Health(3);
        const coins = new Coins(0);
        const collider = new Collider({
            width: 1, height: 1,
            isRigid: true,
            initialPosition: spawn,
            onCollision: this.handleCollision.bind(this)
        });

        const swordSides = [
            { x: 0.45, y: -1, height: 1, width: 0.1 },
            { x: 1, y: 0.45, height: 0.1, width: 1 },
            { x: 0.45, y: 1, height: 1, width: 0.1 },
            { x: -1, y: 0.45, height: 0.1, width: 1 },
        ];

        const swordHurtboxes = new ColliderGroup([
            ...swordSides.map(props => ({
                isEnabled: false, offset: { x: props.x, y: props.y },
                component: new Collider({
                    initialPosition: spawn,
                    height: props.height, width: props.width,
                    tag: "weapon",
                    onCollision: this.handleWeaponCollision
                })
            }))
        ])

        const movement = new Movement({
            x: 0, y: 0,
            onStop: this.handleStop
        });
        const animation = new SpriteAnimation([
            { name: 'standing_' + PlayerDirection.n, frames: [Link_3], interval: -1 },
            { name: 'standing_' + PlayerDirection.s, frames: [Link_1], interval: -1 },
            { name: 'standing_' + PlayerDirection.e, frames: [Link_4], interval: -1 },
            { name: 'standing_' + PlayerDirection.w, frames: [Link_2], interval: -1 },
            { name: 'walking_' + PlayerDirection.n, frames: [Link_3, Link_7], interval: 166 },
            { name: 'walking_' + PlayerDirection.s, frames: [Link_1, Link_5], interval: 166 },
            { name: 'walking_' + PlayerDirection.e, frames: [Link_4, Link_8], interval: 166 },
            { name: 'walking_' + PlayerDirection.w, frames: [Link_2, Link_6], interval: 166 },
        ], "standing_s");
        this.addComponent(sprite);
        this.addComponent(health);
        this.addComponent(coins);
        this.addComponent(collider);
        this.addComponent(movement);
        this.addComponent(animation);
        this.addComponent(swordHurtboxes);

        /* Inputs */
        const input = new Input({
            config: {
                "w": () => this.handleInputMovement(PlayerDirection.n),
                "a": () => this.handleInputMovement(PlayerDirection.w),
                "s": () => this.handleInputMovement(PlayerDirection.s),
                "d": () => this.handleInputMovement(PlayerDirection.e),
                "l": () => this.handleInputSword()
            }
        });
        this.addComponent(input);
    }

    handleInputMovement = (direction: PlayerDirection) => {
        const animation = this.getComponent(SpriteAnimation) as SpriteAnimation;
        const movement = this.getComponent(Movement) as Movement;

        this.facingDirection = direction;
        animation.changeState(`walking_${direction}`);

        if (direction === PlayerDirection.n) movement.addSpeed(0, -this.playerSpeed);
        if (direction === PlayerDirection.s) movement.addSpeed(0, this.playerSpeed);
        if (direction === PlayerDirection.w) movement.addSpeed(-this.playerSpeed, 0);
        if (direction === PlayerDirection.e) movement.addSpeed(this.playerSpeed, 0);
    }

    handleInputSword = () => {
        const swordHurtboxes = this.getComponent(ColliderGroup) as ColliderGroup;
        swordHurtboxes.colliders[this.facingDirection].isEnabled = true;
        setTimeout(() => {

            swordHurtboxes.colliders[this.facingDirection].isEnabled = false;
        }, 64);
    }

    handleStop = () => {
        const animation = this.getComponent(SpriteAnimation) as SpriteAnimation;
        animation.changeState(`standing_${this.facingDirection}`);
    }

    handleCollision(target: Entity, colliderTag: string) {
        if (target.tag === "coin") {
            (this.getComponent(Coins) as Coins).earnCoins(1);
            target.setDisabled(true);
        }

        const isTargetRigid = (target.getComponent(Collider) as Collider).isRigid;
        const isTargetEnemy = target.tag === "enemy";

        if (isTargetRigid && !isTargetEnemy) handleRigidCollision(this, target);
    }

    handleWeaponCollision(target: Entity, scene, direction: Coordinate2d) {
        const isTargetEnemy = target.tag === "enemy";
        if (!isTargetEnemy) return;

        const health = target.getComponent(Health) as Health;
        const movement = target.getComponent(Movement) as Movement;

        if (!health.invincibleTime) {
            const { x, y } = direction;
            health.decrementHealth(1);
            health.invincibleTime = 1500;
            movement.setSpeed(x * 0.10, y * 0.10);
            return;
        }
    }
}

interface IPlayerProps {
    spawn: {
        x: number;
        y: number;
    }
}

enum PlayerDirection {
    n,
    e,
    s,
    w
}