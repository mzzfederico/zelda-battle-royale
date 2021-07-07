import { ROOM_WIDTH, ROOM_HEIGHT, TILE_SIZE } from "../../constants";

import Scene from "../../@core/Scene";
import SystemSpriteRenderer from "../../@core/Systems/SpriteRender.System";
import Player from "../../Objects/Player";
import Floor from "../../Objects/Floor";
import SystemCanvas from "../../@core/Systems/Canvas.System";
import Wall from "../../Objects/Wall";
import SystemHealthMeter from "../../Systems/SystemHealthMeter";
import SystemCoinMeter from "../../Systems/SystemCoinMeter";
import SystemCollision from "../../@core/Systems/Collision.System";
import InputManager from "../../@core/Systems/Input.System";
import MovementSystem from "../../@core/Systems/Movement.System";
import Coin from "../../Objects/Coin";

export default class Gameplay extends Scene {
    constructor() {
        const player = new Player({ spawn: { x: 3, y: 3 } });
        const floor = new Floor();
        const walls = [
            new Wall({ side: "n", id: "wallN", hasCorners: true, x: 0, y: 0, length: ROOM_WIDTH }),
            new Wall({ side: "w", id: "wallW", x: 0, y: 1, length: ROOM_WIDTH - 2 }),
            new Wall({ side: "e", id: "wallE", x: ROOM_WIDTH - 1, y: 1, length: ROOM_WIDTH - 2 }),
            new Wall({ side: "s", id: "wallS", hasCorners: true, x: 0, y: ROOM_HEIGHT - 1, length: ROOM_WIDTH })
        ];
        const coin = new Coin({ x: 10, y: 4 });

        const coinMeter = new SystemCoinMeter();
        const healthMeter = new SystemHealthMeter();
        const spriteRendering = new SystemSpriteRenderer();
        const collisions = new SystemCollision();
        const input = new InputManager();
        const canvas = new SystemCanvas(ROOM_WIDTH * TILE_SIZE, ROOM_HEIGHT * TILE_SIZE);
        const movement = new MovementSystem();

        super(
            "root",
            [player, floor, coin, ...walls],
            [canvas, spriteRendering, healthMeter, coinMeter, movement, collisions, input]
        );

        this.start();
    }
}