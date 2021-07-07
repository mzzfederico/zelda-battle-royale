import Tilemap from "../@core/Components/Tilemap.Component";
import Entity from "../@core/Entities";
import { ROOM_HEIGHT, ROOM_WIDTH } from "../constants";
import BricksTileset from "../Tilesets/bricks";

export default class Floor extends Entity {
    constructor() {
        super({ id: "floor" });

        /* Empty space */
        const tileRow = new Array(ROOM_WIDTH).fill(-1);
        const rows = new Array(ROOM_HEIGHT).fill(tileRow);
        /* Corners */

        this.addComponent(new Tilemap(BricksTileset, rows));
    }
}