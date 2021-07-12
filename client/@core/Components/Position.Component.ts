import Component from ".";
import { roundFloat } from "../Utils/rounding";

export default class Position extends Component {
    x: number;
    y: number;

    constructor({ x, y }) {
        super();

        this.x = x;
        this.y = y;
    }

    setPosition(x, y): void {
        this.x = isNaN(x) ? this.x : x;
        this.y = isNaN(y) ? this.y : y;
    }

    transformation(x, y): void {
        if (x === 0 && y === 0) return;
        this.setPosition(roundFloat(this.x + x), roundFloat(this.y + y));
    }
}