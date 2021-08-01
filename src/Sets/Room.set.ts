import { ROOM_WIDTH, ROOM_HEIGHT, TILE_SIZE } from "../constants";

import Doorway, { DoorwayDirection, DoorwayState } from "../Entities/Doorway";
import Floor from "../Entities/Floor";
import Wall from "../Entities/Wall";
import Entity from "__Core/Entity";
import randomPosition from "../../../engine/Utils/randomPosition";
import Coin from "../Entities/Coin";

export default class RoomSet {
    constructor(
        content: Entity[] = []
    ) {
        const floor = new Floor();
        const walls = [
            ...this.generateWall(DoorwayDirection.Top),
            ...this.generateWall(DoorwayDirection.Left),
            ...this.generateWall(DoorwayDirection.Bottom),
            ...this.generateWall(DoorwayDirection.Right)
        ];


        const coins = [];

        let i = 12;
        while (i > 0) {
            coins.push(
                new Coin(randomPosition(ROOM_WIDTH, ROOM_HEIGHT))
            );
            i--;
        }

        this.contents = [floor, ...coins, ...walls, ...content];
    }

    onDoorwayEntry: Function;

    contents: Entity[];

    generateWall(
        direction: DoorwayDirection = DoorwayDirection.Top
    ): Entity[] {
        const wallEntities = [];

        const horLength = 8;
        const verLength = 4;

        if (direction === DoorwayDirection.Top) {
            wallEntities.push(
                new Wall({ side: "n", id: "wallN1", x: 1, y: 0, length: horLength }),
                new Wall({ side: "n", id: "wallN2", x: ROOM_WIDTH - 9, y: 0, length: horLength }),
            )
        }
        if (direction === DoorwayDirection.Right) {
            const xOffset = ROOM_WIDTH - 1;
            wallEntities.push(
                new Wall({ side: "e", id: "wallE1", x: xOffset, y: 1, length: verLength }),
                new Wall({ side: "e", id: "wallE2", x: xOffset, y: ROOM_HEIGHT - 5, length: verLength })
            )
        }
        if (direction === DoorwayDirection.Bottom) {
            const yOffset = ROOM_HEIGHT - 1;
            wallEntities.push(
                new Wall({ side: "s", id: "wallS1", x: 1, y: yOffset, length: horLength }),
                new Wall({ side: "s", id: "wallS2", x: ROOM_WIDTH - 9, y: yOffset, length: horLength })
            )
        }
        if (direction === DoorwayDirection.Left) {
            wallEntities.push(
                new Wall({ side: "w", id: "wallW1", x: 0, y: 1, length: verLength }),
                new Wall({ side: "w", id: "wallW2", x: 0, y: ROOM_HEIGHT - 5, length: verLength })
            )
        }

        return [...wallEntities];
    }
}
