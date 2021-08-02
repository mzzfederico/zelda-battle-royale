
import Entity from "__Core/Entity";

import Link_1 from "../Sprites/Link/1.png";
import Link_2 from "../Sprites/Link/2.png";
import Link_3 from "../Sprites/Link/3.png";
import Link_4 from "../Sprites/Link/4.png";
import Link_5 from "../Sprites/Link/5.png";
import Link_6 from "../Sprites/Link/6.png";
import Link_7 from "../Sprites/Link/7.png";
import Link_8 from "../Sprites/Link/8.png";

import Position from "__Components/Position.Component";
import Sprite from "__Components/Sprite.Component";
import Health from "../Components/Health.Component";
import Coins from "../Components/Coins.Component";
import Collider from "__Components/Collider.Component";
import Input from "__Components/Input.Component";
import Movement from "__Components/Movement.Component";
import SpriteAnimation from "__Components/SpriteAnimation.Component";
import Scene from "__Core/Scene";
import handleRigidCollision from "../../../engine/Utils/handleRigidCollision";

export default class Player extends Entity {
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
        const movement = new Movement({
            x: 0, y: 0,
            onStop: this.handleStop
        });
        const animation = new SpriteAnimation([
            { name: 'standing_n', frames: [Link_3], interval: -1 },
            { name: 'standing_s', frames: [Link_1], interval: -1 },
            { name: 'standing_e', frames: [Link_4], interval: -1 },
            { name: 'standing_w', frames: [Link_2], interval: -1 },
            { name: 'walking_n', frames: [Link_3, Link_7], interval: 166, nextState: 'standing_n' },
            { name: 'walking_s', frames: [Link_1, Link_5], interval: 166, nextState: 'standing_s' },
            { name: 'walking_e', frames: [Link_4, Link_8], interval: 166, nextState: 'standing_e' },
            { name: 'walking_w', frames: [Link_2, Link_6], interval: 166, nextState: 'standing_w' },
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
                "w": () => this.handleInputMovement("n"),
                "a": () => this.handleInputMovement("w"),
                "s": () => this.handleInputMovement("s"),
                "d": () => this.handleInputMovement("e"),
            }
        });
        this.addComponent(input);
    }

    handleInputMovement = (direction) => {
        const animation = this.getComponent(SpriteAnimation) as SpriteAnimation;
        const movement = this.getComponent(Movement) as Movement;

        animation.changeState(`walking_${direction}`);

        if (direction === "n") movement.addSpeed(0, -this.playerSpeed);
        if (direction === "s") movement.addSpeed(0, this.playerSpeed);
        if (direction === "w") movement.addSpeed(-this.playerSpeed, 0);
        if (direction === "e") movement.addSpeed(this.playerSpeed, 0);
    }

    handleStop = () => {
        const animation = this.getComponent(SpriteAnimation) as SpriteAnimation;
        animation.nextState();
    }

    handleCollision(target: Entity, scene: Scene) {
        if (target.tag === "coin") {
            (this.getComponent(Coins) as Coins).earnCoins(1);
            target.setDisabled(true);
            scene.removeEntity(target.id);
        }

        const isTargetRigid = (target.getComponent(Collider) as Collider).isRigid;
        const isTargetEnemy = target.tag === "enemy";

        if (isTargetRigid && !isTargetEnemy) handleRigidCollision(this, target);
    }
}

interface IPlayerProps {
    spawn: {
        x: number;
        y: number;
    }
}