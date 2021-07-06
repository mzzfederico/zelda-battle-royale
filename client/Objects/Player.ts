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

export default class Player extends Entity {
    spriteDirections = { n, w, e, s };

    playerSpeed = 0.007;

    constructor({ spawn = { x: 0, y: 0 } }: IPlayerProps) {
        super({ id: "player", x: spawn.x, y: spawn.y });

        const sprite = new Sprite({ src: s, width: 1, height: 1 });
        const health = new Health(3);
        const coins = new Coins(0);
        const collider = new Collider({ width: 1, height: 1, isStatic: false, onCollision: this.handleCollision.bind(this) });
        const movement = new Movement({ x: 0, y: 0 });
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
        if (direction === "n") this.getComponent('movement').setSpeed(0, -this.playerSpeed);
        if (direction === "s") this.getComponent('movement').setSpeed(0, this.playerSpeed);
        if (direction === "w") this.getComponent('movement').setSpeed(-this.playerSpeed, 0);
        if (direction === "e") this.getComponent('movement').setSpeed(this.playerSpeed, 0);
        this.getComponent("sprite").replaceSource(this.spriteDirections[direction]);
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