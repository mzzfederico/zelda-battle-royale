import Collider from "../@core/Components/Collider.Component";
import Sprite from "../@core/Components/Sprite.Component";
import Entity from "../@core/Entities";

import coin from "../Sprites/coin/coin.png";

export default class Coin extends Entity {
    constructor({ x = 3, y = 3 }) {
        super({ id: "coin", x, y });

        const [width, height] = [0.3, 0.5];

        const coinSprite = new Sprite({ src: coin, width, height });
        const coinCollider = new Collider({ width, height, isStatic: false });
        this.addComponent(coinSprite);
        this.addComponent(coinCollider);
    }
}
