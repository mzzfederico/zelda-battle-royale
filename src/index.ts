import GameLoop from "__Core/GameLoop";
import Scene from "__Core/Scene";
import { ROOM_HEIGHT, ROOM_WIDTH } from "./constants";
import Dungeon from "./Dungeon";
import Doorway, { DoorwayDirection } from "./Entities/Doorway";
import Player from "./Entities/Player";
import Room from "./Sets/Room.set";
import EnemyAI from "./Systems/EnemyIA";
import SystemCoinMeter from "./Systems/SystemCoinMeter";
import SystemDebugPlayer from "./Systems/SystemDebugPlayer";
import SystemHealthMeter from "./Systems/SystemHealthMeter";

document.addEventListener('readystatechange', event => {
    if (event.target.readyState === "complete") {
        Main();
    }
});

function Main() {
    const player = new Player({ spawn: { x: 9.5, y: 5.5 } });

    const healthMeter = new SystemHealthMeter();
    const coinMeter = new SystemCoinMeter();
    const enemyAI = new EnemyAI();
    /* To be disabled... */
    const debug = new SystemDebugPlayer();

    const gameplayScene = new Scene("gameplay", [], [enemyAI, healthMeter, coinMeter, debug]);
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
    game.currentScene.addEntity(player);
    player.room = dungeon.roomIndex;

    console.log(game.currentScene);
}