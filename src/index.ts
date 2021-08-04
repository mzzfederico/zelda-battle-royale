import GameLoop from "__Core/GameLoop";
import Scene from "__Core/Scene";
import { ROOM_HEIGHT, ROOM_WIDTH } from "./constants";
import Dungeon from "./Dungeon";
import Doorway, { DoorwayDirection } from "./Entities/Doorway";
import Player from "./Entities/Player";
import Room from "./Sets/Room.set";
import SystemEnemy from "./Systems/SystemEnemy";
import SystemCoinMeter from "./Systems/SystemCoinMeter";
import SystemDebugPlayer from "./Systems/SystemDebugPlayer";
import SystemHealthMeter from "./Systems/SystemHealthMeter";
import Sword from "./Entities/Sword";

document.addEventListener('readystatechange', event => {
    if (event.target.readyState === "complete") {
        Main();
    }
});

function Main() {
    const player = new Player({ spawn: { x: 9.5, y: 5.5 } });

    const healthMeter = new SystemHealthMeter();
    const coinMeter = new SystemCoinMeter();
    const systemEnemy = new SystemEnemy();
    /* To be disabled... */
    const debug = new SystemDebugPlayer();

    const gameplayScene = new Scene("gameplay", [], [systemEnemy, healthMeter, coinMeter, debug]);
    const game = new GameLoop(gameplayScene);
    const dungeon = new Dungeon(game);

    /* Doorways */
    const xOffset = ROOM_WIDTH - 1;
    const yOffset = ROOM_HEIGHT - 1;

    const handleEntry = (direction) => dungeon.changeRoom(direction);

    [
        new Doorway({ x: ROOM_WIDTH - 9 - 2, y: -1, direction: DoorwayDirection.Top, handleEntry }),
        new Doorway({ x: xOffset + 2, y: ROOM_HEIGHT - 5 - 2, direction: DoorwayDirection.Right, handleEntry }),
        new Doorway({ x: ROOM_WIDTH - 9 - 2, y: yOffset + 2, direction: DoorwayDirection.Bottom, handleEntry }),
        new Doorway({ x: -1, y: ROOM_HEIGHT - 5 - 2, direction: DoorwayDirection.Left, handleEntry })
    ].forEach(entity => game.currentScene.addEntity(entity));

    /* Spawn player */
    const swordSides = [
        { x: 0.45, y: -1, height: 0.85, width: 0.15 },
        { x: 1, y: 0.45, height: 0.15, width: 0.85 },
        { x: 0.45, y: 1, height: 0.85, width: 0.15 },
        { x: -1, y: 0.45, height: 0.15, width: 0.85 },
    ];

    swordSides.forEach((side, index) => {
        const sword = new Sword({ owner: player.id, posSize: side, direction: index });
        game.currentScene.addEntity(sword);
    });

    game.currentScene.addEntity(player);
    player.room = dungeon.roomIndex;

    game.start();
    console.log(game.currentScene.entities);
}