import { TILE_SIZE, ZOOM } from "../../constants";

const realTileSize = TILE_SIZE * ZOOM;

export function drawTileMap(ctx, map, tileset, offset) {
    const image = new Image();
    image.src = tileset.src;

    function getTile(col, row) {
        return map[row][col];
    }

    image.onload = () => {
        for (var c = 0; c < map[0].length; c++) {
            for (var r = 0; r < map.length; r++) {
                var tile = getTile(c, r);
                if (tile >= 0) ctx.drawImage(
                    image, // image
                    (tile % tileset.w) * TILE_SIZE, // source x
                    Math.floor(tile / tileset.w) * TILE_SIZE, // source y
                    TILE_SIZE, // source width
                    TILE_SIZE, // source height
                    (c * realTileSize) + (offset.x * realTileSize), // target x
                    (r * realTileSize) + (offset.y * realTileSize), // target y
                    realTileSize, // target width
                    realTileSize // target height
                );
            }
        }
    }
}

export function drawTileImage(ctx, position = { x: 1, y: 1 }, size = { x: 1, y: 1 }, tileSrc = '') {
    const image = new Image();
    image.src = tileSrc;

    image.onload = () => {
        ctx.drawImage(
            image, // image
            position.x * size.x * TILE_SIZE, // source x
            position.y * size.y * TILE_SIZE, // source y
            TILE_SIZE, // source width
            TILE_SIZE, // source height
            position.x * realTileSize, // target x
            position.y * realTileSize, // target y
            realTileSize, // target width
            realTileSize // target height
        );
    }
}