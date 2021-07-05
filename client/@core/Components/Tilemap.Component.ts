import Component from ".";
import BricksTileset from "../../Tilesets/bricks";
import Tileset from "../Assets/Tileset";

export default class Tilemap extends Component {
    set: Tileset = BricksTileset;
    map: Array[] = [[]];

    constructor(set, map) {
        super({ name: 'tilemap' });
        this.set = set;
        this.map = map;
    }
}