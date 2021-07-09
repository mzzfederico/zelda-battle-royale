import Component from ".";
import { roundFloat } from "../Utils/rounding";

export default class Movement extends Component {
    x: number;
    y: number;
    onStart: Function;
    onStop: Function;

    constructor({ x, y, onStart = () => { }, onStop = () => { } }) {
        super();
        this.x = x;
        this.y = y;
        this.onStart = onStart;
        this.onStop = onStop;
    }

    addSpeed(x, y) {
        this.x = roundFloat(this.x + x, 100_000);
        this.y = roundFloat(this.y + y, 100_000);
    }

    setSpeed(x, y) {
        this.x = x;
        this.y = y;
    }

    multiplySpeed(x, y) {
        this.x = roundFloat(this.x * x, 100_000);
        this.y = roundFloat(this.y * y, 100_000);
    }

    clearSpeed() {
        this.x = 0;
        this.y = 0;
    }

    isMoving() {
        return this.x === 0 && this.y === 0;
    }
}