import Collider from "../@core/Components/Collider.Component";
import Sprite from "../@core/Components/Sprite.Component";
import Entity from "../@core/Entities";

import coin from "../Sprites/coin/coin.png";

export default class Coin extends Entity {
    constructor({ x = 3, y = 3 }) {
        super({ id: "coin", x, y });

        const coinSprite = new Sprite({ src: coin, height: 8, width: 5 });
        const coinCollider = new Collider({ height: 8, width: 5, isStatic: false });
        this.addComponent(coinSprite);
        this.addComponent(coinCollider);
    }
}
