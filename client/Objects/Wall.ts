import Tilemap from "../@core/Components/Tilemap.Component";
import Entity from "../@core/Entities";
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
    hasCorners: boolean = false;
    side: string = "n";

    constructor({ id = "wall", side, hasCorners = false, x = 0, y = 0, length = 1 }: IWallProps) {
        super({ id, x, y });

        this.side = side;
        this.hasCorners = hasCorners;

        let width = 1;
        let height = 1;
        if (side === "n" || side === "s") width = length;
        if (side === "w" || side === "e") height = length;

        const wallTileMap = (new Array(height))
            .fill(
                (new Array(width)).fill(tilesPerDirection[side]).map((tile, index, wallArray) => {
                    if (!hasCorners) return tile;

                    if (side in cornerTiles) {
                        if (index === 0) return cornerTiles[side][0];
                        if (index === (wallArray.length - 1)) return cornerTiles[side][1];
                        return tile;
                    }
                    return tile;
                })
            );

        this.addComponent(new Tilemap(BricksTileset, wallTileMap));
    }
}

interface IWallProps {
    id: string;
    side: string;
    hasCorners?: boolean;
    x?: number;
    y?: number;
    length?: number;
}