import Sprite from "../@core/Components/Sprite.Component";
import Entity from "../@core/Entities";

import n from "../Sprites/player/n.png";
import w from "../Sprites/player/w.png";
import s from "../Sprites/player/s.png";
import e from "../Sprites/player/e.png";
import Health from "../Components/Health.Component";
import Coins from "../Components/Coins.Component";
import Collider from "../@core/Components/Collider.Component";

export default class Player extends Entity {
    constructor({ spawn = { x: 0, y: 0 } }: IPlayerProps) {
        super({ id: "player", x: spawn.x, y: spawn.y });

        const sprite = new Sprite({ src: s });
        const health = new Health(3);
        const coins = new Coins(0);
        const collider = new Collider({ width: 16, height: 16, isStatic: false, onCollision: this.handleCollision.bind(this) });
        this.addComponent(sprite);
        this.addComponent(health);
        this.addComponent(coins);
        this.addComponent(collider);
    }

    handleCollision(target) {
        if (target.id === "coin") {
            this.components.coins.earnCoins(1);
            target.setDisabled(true);
        }
    }
}

interface IPlayerProps {
    spawn: {
        x: number;
        y: number;
    }
}