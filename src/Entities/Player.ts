
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
import Relationship, { IRelationshipProps } from "__Components/Relationship.Component";
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
    direction: PlayerDirection = PlayerDirection.s;
    speed: number = 0.0035;
    room: number[] = [0, 0];

    /* Animation lock for melee attacks */
    meleeWeaponTag: string = "sword";
    meleeTimeout: number = 0;

    constructor({ spawn = { x: 0, y: 0 } }: IPlayerProps) {
        super({ tag: "player", x: spawn.x, y: spawn.y });

        const sprite = new Sprite({
            src: Link_1, width: 1, height: 1
        });

        const health = new Health(3);
        const coins = new Coins(0);
        const collider = new Collider({
            width: 1, height: 1,
            isRigid: true,
            initialPosition: spawn,
            onCollision: this.handleCollision.bind(this)
        });

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

        /* Inputs */
        const input = new Input({
            config: {
                "w": () => this.handleInputMovement(PlayerDirection.n),
                "a": () => this.handleInputMovement(PlayerDirection.w),
                "s": () => this.handleInputMovement(PlayerDirection.s),
                "d": () => this.handleInputMovement(PlayerDirection.e),
                "l": () => this.handleMeleeInput()
            }
        });
        this.addComponent(input);
    }

    handleInputMovement = (direction: PlayerDirection) => {
        const animation = this.getComponent(SpriteAnimation) as SpriteAnimation;
        const movement = this.getComponent(Movement) as Movement;

        if (!this.meleeTimeout) {
            this.direction = direction;
            animation.changeState(`walking_${direction}`);
        }

        if (direction === PlayerDirection.n) movement.addSpeed(0, -this.speed);
        if (direction === PlayerDirection.s) movement.addSpeed(0, this.speed);
        if (direction === PlayerDirection.w) movement.addSpeed(-this.speed, 0);
        if (direction === PlayerDirection.e) movement.addSpeed(this.speed, 0);
    }

    handleMeleeInput = () => {
        this.meleeTimeout = 150;
    }

    handleStop = () => {
        const animation = this.getComponent(SpriteAnimation) as SpriteAnimation;
        animation.changeState(`standing_${this.direction}`);
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
}

export interface IPlayerProps {
    spawn: {
        x: number;
        y: number;
    }
}

export enum PlayerDirection {
    n,
    e,
    s,
    w
}