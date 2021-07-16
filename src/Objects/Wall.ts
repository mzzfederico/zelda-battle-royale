import Collider from "__Components/Collider.Component";
import Tilemap from "__Components/Tilemap.Component";
import Entity from "__Core/Entity";
import BricksTileset from "../Tilesets/bricks";

const tilesPerDirection = {
    n: 1,
    w: 11,
    e: 13,
    s: 23
}

const cornerTiles = {
    n: [0, 2],
    s: [22, 24]
}

export default class Wall extends Entity {
    side: string = "n";

    constructor({ id = "wall", side, x = 0, y = 0, length = 1 }: IWallProps) {
        super({ id, x, y });

        this.side = side;

        let width = 1;
        let height = 1;
        if (side === "n" || side === "s") width = length;
        if (side === "w" || side === "e") height = length;

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
    side: string;
    x?: number;
    y?: number;
    length?: number;
}