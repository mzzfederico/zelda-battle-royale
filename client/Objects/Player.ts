import Sprite from "../@core/Components/Sprite.Component";
import Entity from "../@core/Entities";

import n from "../Sprites/player/n.png";
import w from "../Sprites/player/w.png";
import s from "../Sprites/player/s.png";
import e from "../Sprites/player/e.png";

import Health from "../Components/Health.Component";
import Coins from "../Components/Coins.Component";
import Collider from "../@core/Components/Collider.Component";
import Input from "../@core/Components/Input.Component";
import Movement from "../@core/Components/Movement.Component";
import SpriteAnimation from "../@core/Components/SpriteAnimation.Component";

export default class Player extends Entity {
    spriteDirections = { n, w, e, s };

    playerSpeed = 0.0035;

    constructor({ spawn = { x: 0, y: 0 } }: IPlayerProps) {
        super({ id: "player", x: spawn.x, y: spawn.y });

        const sprite = new Sprite({ src: s, width: 1, height: 1 });
        const health = new Health(3);
        const coins = new Coins(0);
        const collider = new Collider({ width: 1, height: 1, isStatic: false, onCollision: this.handleCollision.bind(this) });
        const movement = new Movement({ x: 0, y: 0 });
        const animation = new SpriteAnimation([
            { name: 'standing_n', frames: [n], interval: 0.7, nextState: 'standing_n' },
            { name: 'standing_s', frames: [s], interval: 0.7, nextState: 'standing_s' },
            { name: 'standing_e', frames: [e], interval: 0.7, nextState: 'standing_e' },
            { name: 'standing_w', frames: [w], interval: 0.7, nextState: 'standing_w' },
            { name: 'walking_n', frames: [n, s], interval: 0.7, nextState: 'standing_n' },
            { name: 'walking_s', frames: [e, w], interval: 0.7, nextState: 'standing_s' },
            { name: 'walking_e', frames: [s, e], interval: 0.7, nextState: 'standing_e' },
            { name: 'walking_w', frames: [w, n], interval: 0.7, nextState: 'standing_w' },
        ], "standing_s");
        this.addComponent(animation);
        this.addComponent(sprite);
        this.addComponent(health);
        this.addComponent(coins);
        this.addComponent(collider);
        this.addComponent(movement);

        /* Inputs */
        const input = new Input({
            config: {
                "w": (timeframe) => this.handleMovement("n"),
                "a": (timeframe) => this.handleMovement("w"),
                "s": (timeframe) => this.handleMovement("s"),
                "d": (timeframe) => this.handleMovement("e"),
            }
        });
        this.addComponent(input);
    }

    handleMovement(direction) {
        const animation: SpriteAnimation = this.getComponent("spriteAnimation");
        const movement: SpriteAnimation = this.getComponent("movement");

        animation.changeState(`walking_${direction}`);

        if (direction === "n") movement.addSpeed(0, -this.playerSpeed);
        if (direction === "s") movement.addSpeed(0, this.playerSpeed);
        if (direction === "w") movement.addSpeed(-this.playerSpeed, 0);
        if (direction === "e") movement.addSpeed(this.playerSpeed, 0);
    }

    handleCollision(target) {
        if (target.id === "coin") {
            this.getComponent("coins").earnCoins(1);
            target.setDisabled(true);
        }
        if (target.components.collider.isRigid) {
            this.getComponent("collider").restoreSafePosition();
            this.getComponent("collider").updateSafePosition();
        }
    }
}

interface IPlayerProps {
    spawn: {
        x: number;
        y: number;
    }
}