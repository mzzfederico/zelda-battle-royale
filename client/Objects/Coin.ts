import { v4 as uuidv4 } from 'uuid';

import Collider from "../Core/Components/Collider.Component";
import Sprite from "../Core/Components/Sprite.Component";
import Entity from "../Core/Entities";

import coin from "../Sprites/coin/coin.png";

export default class Coin extends Entity {
    constructor({ x = 3, y = 3 }) {
        super({ id: uuidv4(), x, y, tag: "coin" });

        const [width, height] = [0.3, 0.5];

        const coinSprite = new Sprite({ src: coin, width, height });
        const coinCollider = new Collider({ width, height, isStatic: false });
        this.addComponent(coinSprite);
        this.addComponent(coinCollider);
    }
}
