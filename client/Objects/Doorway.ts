import Tilemap from "../@core/Components/Tilemap.Component";
import Entity from "../@core/Entities";
import BricksTileset from "../Tilesets/bricks";

export default class Doorway extends Entity {
    constructor({ id = "doorway", x = 0, y = 1, direction = "w" }) {
        super({ id, x, y });

        this.addComponent(new Tilemap(BricksTileset, [[12]]));
    }
}