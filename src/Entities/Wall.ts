import Collider from "__Components/Collider.Component";
import Tilemap from "__Components/Tilemap.Component";
import Entity from "__Core/Entity";
import BricksTileset from "../Tilesets/bricks";
import { DoorwayDirection } from "./Doorway";

const tilesPerDirection = {
    [DoorwayDirection.Top]: 1,
    [DoorwayDirection.Right]: 13,
    [DoorwayDirection.Bottom]: 23,
    [DoorwayDirection.Left]: 11
}

const cornerTiles = {
    n: [0, 2],
    s: [22, 24]
}

export default class Wall extends Entity {
    side: DoorwayDirection = DoorwayDirection.Top;

    constructor({ id = "wall", side = DoorwayDirection.Top, x = 0, y = 0, length = 1 }: IWallProps) {
        super({ id, x, y });

        this.side = side;

        let width = 1;
        let height = 1;
        if (side === DoorwayDirection.Top || side === DoorwayDirection.Bottom) width = length;
        if (side === DoorwayDirection.Left || side === DoorwayDirection.Right) height = length;

        const wallTileMap = (new Array(height))
            .fill(
                (new Array(width)).fill(tilesPerDirection[side])
            );

        this.addComponent(new Tilemap(BricksTileset, wallTileMap));
        this.addComponent(new Collider({ width, height, isRigid: true }));
    }
}

interface IWallProps {
    id: string;
    side: DoorwayDirection;
    x?: number;
    y?: number;
    length?: number;
}