import Component from ".";
import { roundFloat } from "../Utils/rounding";

export default class Position extends Component {
    x: number;
    y: number;

    constructor({ x, y }) {
        super({ name: "position" });

        this.x = x;
        this.y = y;
    }

    setPosition(x, y): void {
        this.x = isNaN(x) ? this.x : x;
        this.y = isNaN(y) ? this.y : y;
    }

    transformation(x, y): void {
        this.setPosition(roundFloat(this.x + x), roundFloat(this.y + y));
    }
}