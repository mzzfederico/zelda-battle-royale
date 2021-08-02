import { ROOM_WIDTH, ROOM_HEIGHT, TILE_SIZE } from "../constants";

import Doorway, { DoorwayDirection, DoorwayState } from "../Entities/Doorway";
import Floor from "../Entities/Floor";
import Wall from "../Entities/Wall";
import Entity from "__Core/Entity";
import randomPosition from "../../../engine/Utils/randomPosition";
import Coin from "../Entities/Coin";

export default class RoomSet {
    constructor(
        content: Entity[] = [],
        wallStates: WallStateEnum[] = [
            WallStateEnum.Open,
            WallStateEnum.Open,
            WallStateEnum.Open,
            WallStateEnum.Open
        ]
    ) {
        const floor = new Floor();
        const walls = [
            DoorwayDirection.Top,
            DoorwayDirection.Right,
            DoorwayDirection.Bottom,
            DoorwayDirection.Left
        ].map(
            direction => this.generateWall(direction, wallStates[direction])
        ).flat();


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
        direction: DoorwayDirection = DoorwayDirection.Top, state: WallStateEnum = WallStateEnum.Open
    ): Entity[] {
        let length = 1;

        const xOffset = ROOM_WIDTH - 1;
        const yOffset = ROOM_HEIGHT - 1;

        let coordinatesByDirection = [];

        if (state === WallStateEnum.Open) {
            if (direction === DoorwayDirection.Top || direction === DoorwayDirection.Bottom) length = 8;
            if (direction === DoorwayDirection.Left || direction === DoorwayDirection.Right) length = 4;

            coordinatesByDirection = [
                [{ x: 1, y: 0 }, { x: ROOM_WIDTH - 9, y: 0 }],
                [{ x: xOffset, y: 1 }, { x: xOffset, y: ROOM_HEIGHT - 5 }],
                [{ x: 1, y: yOffset }, { x: ROOM_WIDTH - 9, y: yOffset }],
                [{ x: 0, y: 1 }, { x: 0, y: ROOM_HEIGHT - 5 }],
            ];
        }

        if (state === WallStateEnum.Closed) {
            if (direction === DoorwayDirection.Top || direction === DoorwayDirection.Bottom) length = ROOM_WIDTH - 2;
            if (direction === DoorwayDirection.Left || direction === DoorwayDirection.Right) length = ROOM_HEIGHT - 2;

            coordinatesByDirection = [
                [{ x: 1, y: 0 }],
                [{ x: xOffset, y: 1 }],
                [{ x: 1, y: yOffset }],
                [{ x: 0, y: 1 }],
            ];
        }

        return coordinatesByDirection[direction].map(
            ((pos, index) => new Wall({ id: `wall${direction}${index}`, side: direction, length, ...pos }))
        );
    }
}

export enum WallStateEnum {
    Open,
    Closed,
    Breakable,
    Broken
}