import { ROOM_WIDTH, ROOM_HEIGHT, TILE_SIZE } from "../../constants";

import Scene from "../../Core/Scene";
import PNGSpriteRender from "../../Core/Systems/PNGSpriteRender.System";
import Player from "../../Objects/Player";
import Floor from "../../Objects/Floor";
import SystemCanvas from "../../Core/Systems/Canvas.System";
import Wall from "../../Objects/Wall";
import SystemDebugPlayer from "../../Systems/SystemDebugPlayer";
import SystemCoinMeter from "../../Systems/SystemCoinMeter";
import SystemCollision from "../../Core/Systems/Collision.System";
import InputManager from "../../Core/Systems/Input.System";
import MovementSystem from "../../Core/Systems/Movement.System";
import Coin from "../../Objects/Coin";
import Doorway, { DoorwayDirection } from "../../Objects/Doorway";
import AnimationSystem from "../../Core/Systems/Animation.System";
import rollDice from "../../Core/Utils/dice";

export default class Gameplay extends Scene {
    constructor() {
        super("root");

        const randomPosition = () => ({ x: rollDice(2, ROOM_WIDTH - 2), y: rollDice(2, ROOM_HEIGHT - 2) });

        const player = new Player({ spawn: randomPosition() });
        const floor = new Floor();
        const walls = [
            ...this.generateWall("n"),
            ...this.generateWall("e"),
            ...this.generateWall("s"),
            ...this.generateWall("w")
        ];


        const coins = [];

        let i = 12;
        while (i > 0) {
            coins.push(
                new Coin(randomPosition())
            );
            i--;
        }
        //const doorwayW = new Doorway({ id: "doorway_w", x: 0, y: (ROOM_HEIGHT - 2) / 2 });

        const coinMeter = new SystemCoinMeter();
        const spriteRendering = new PNGSpriteRender();
        const collisions = new SystemCollision();
        const input = new InputManager();
        const canvas = new SystemCanvas(ROOM_WIDTH * TILE_SIZE, ROOM_HEIGHT * TILE_SIZE);
        const movement = new MovementSystem();
        const animation = new AnimationSystem();

        /* To be disabled... */
        const debug = new SystemDebugPlayer();

        [player, floor, ...coins, ...walls].forEach(this.addEntity);
        [canvas, spriteRendering, coinMeter, movement, collisions, input, animation, debug].forEach(this.addSystem);
    }

    generateWall(direction = "n", doorway = 'closed') {
        const wallEntities = [];

        const horLength = 8;
        const verLength = 4;

        if (direction === 'n') {
            wallEntities.push(
                new Wall({ side: "n", id: "wallN1", x: 1, y: 0, length: horLength }),
                new Wall({ side: "n", id: "wallN2", x: ROOM_WIDTH - 9, y: 0, length: horLength }),
                new Doorway({ x: ROOM_WIDTH - 9 - 2, y: 0, direction: DoorwayDirection.Horizontal })
            )
        }
        if (direction === 'w') {
            wallEntities.push(
                new Wall({ side: "w", id: "wallW1", x: 0, y: 1, length: verLength }),
                new Wall({ side: "w", id: "wallW2", x: 0, y: ROOM_HEIGHT - 5, length: verLength }),
                new Doorway({ x: 0, y: ROOM_HEIGHT - 5 - 2, direction: DoorwayDirection.Vertical })
            )
        }
        if (direction === 's') {
            const yOffset = ROOM_HEIGHT - 1;
            wallEntities.push(
                new Wall({ side: "s", id: "wallS1", x: 1, y: yOffset, length: horLength }),
                new Wall({ side: "s", id: "wallS2", x: ROOM_WIDTH - 9, y: yOffset, length: horLength }),
                new Doorway({ x: ROOM_WIDTH - 9 - 2, y: yOffset + 1, direction: DoorwayDirection.Horizontal })
            )
        }
        if (direction === 'e') {
            const xOffset = ROOM_WIDTH - 1;
            wallEntities.push(
                new Wall({ side: "e", id: "wallE1", x: xOffset, y: 1, length: verLength }),
                new Wall({ side: "e", id: "wallE2", x: xOffset, y: ROOM_HEIGHT - 5, length: verLength }),
                new Doorway({ x: xOffset + 1, y: ROOM_HEIGHT - 5 - 2, direction: DoorwayDirection.Vertical })
            )
        }

        return [...wallEntities];
    }
}