
import Entity from "../Core/Entities";

import Link_1 from "../Sprites/Link/1.png";
import Link_2 from "../Sprites/Link/2.png";
import Link_3 from "../Sprites/Link/3.png";
import Link_4 from "../Sprites/Link/4.png";
import Link_5 from "../Sprites/Link/5.png";
import Link_6 from "../Sprites/Link/6.png";
import Link_7 from "../Sprites/Link/7.png";
import Link_8 from "../Sprites/Link/8.png";

import Position from "../Core/Components/Position.Component";
import Sprite from "../Core/Components/Sprite.Component";
import Health from "../Components/Health.Component";
import Coins from "../Components/Coins.Component";
import Collider from "../Core/Components/Collider.Component";
import Input from "../Core/Components/Input.Component";
import Movement from "../Core/Components/Movement.Component";
import SpriteAnimation from "../Core/Components/SpriteAnimation.Component";
import Scene from "../Core/Scene";

export default class Player extends Entity {
    playerSpeed = 0.0035;

    constructor({ spawn = { x: 0, y: 0 } }: IPlayerProps) {
        super({ tag: "player", x: spawn.x, y: spawn.y });

        const sprite = new Sprite({ src: Link_1, width: 1, height: 1 });
        const health = new Health(3);
        const coins = new Coins(0);
        const collider = new Collider({ width: 1, height: 1, isStatic: false, onCollision: this.handleCollision.bind(this) });
        const movement = new Movement({ x: 0, y: 0, onStop: this.handleStop });
        const animation = new SpriteAnimation([
            { name: 'standing_n', frames: [Link_3], interval: 300 },
            { name: 'standing_s', frames: [Link_1], interval: 300 },
            { name: 'standing_e', frames: [Link_4], interval: 300 },
            { name: 'standing_w', frames: [Link_2], interval: 300 },
            { name: 'walking_n', frames: [Link_3, Link_7], interval: 300, nextState: 'standing_n' },
            { name: 'walking_s', frames: [Link_1, Link_5], interval: 300, nextState: 'standing_s' },
            { name: 'walking_e', frames: [Link_4, Link_8], interval: 300, nextState: 'standing_e' },
            { name: 'walking_w', frames: [Link_2, Link_6], interval: 300, nextState: 'standing_w' },
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
        if (target.tag === "doorway") {
            /* scene.end(); */
        }
        if (target.tag === "coin") {
            (this.getComponent(Coins) as Coins).earnCoins(1);
            scene.removeEntity(target.id);
        }
        if ((target.getComponent(Collider) as Collider).isRigid) {
            const position = this.getComponent(Position) as Position;
            const collider = this.getComponent(Collider) as Collider;

            /* Obtain safe position and restore it */
            const { x, y } = collider.getSafePosition();
            position.setPosition(x, y);
            collider.saveSafePosition(x, y);
        }
    }
}

interface IPlayerProps {
    spawn: {
        x: number;
        y: number;
    }
}