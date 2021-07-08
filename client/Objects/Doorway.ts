import Entity from "../@core/Entities";

export default class Doorway extends Entity {
    constructor({ id = "doorway", x = 0, y = 1 }) {
        super({ id, tag: "doorway", x, y });
    }
}