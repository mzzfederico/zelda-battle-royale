import Tilemap from "../Core/Components/Tilemap.Component";
import Entity from "../Core/Entities";
import { ROOM_HEIGHT, ROOM_WIDTH } from "../constants";
import BricksTileset from "../Tilesets/bricks";

export default class Floor extends Entity {
    constructor() {
        super({ tag: "floor" });

        /* Empty space */
        const rows = Array.from(Array(ROOM_HEIGHT), () => new Array(ROOM_WIDTH).fill(-1));

        /* Corners */
        rows[0][0] = 0;
        rows[0][ROOM_WIDTH - 1] = 2;
        rows[ROOM_HEIGHT - 1][0] = 22;
        rows[ROOM_HEIGHT - 1][ROOM_WIDTH - 1] = 24;

        this.addComponent(new Tilemap(BricksTileset, rows));
    }
}