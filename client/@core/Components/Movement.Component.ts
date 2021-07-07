import Component from ".";

export default class Movement extends Component {
    x: number;
    y: number;

    constructor({ x, y, onStart = () => { }, onStop = () => { } }) {
        super({ name: "movement" });
        this.x = x;
        this.y = y;
        this.onStart = onStart;
        this.onStop = onStop;
    }

    addSpeed(x, y) {
        this.x = this.x + x;
        this.y = this.y + y;
    }

    setSpeed(x, y) {
        this.x = x;
        this.y = y;
    }

    multiplySpeed(x, y) {
        this.x = this.x * x;
        this.y = this.y * y;
    }

    clearSpeed() {
        this.x = 0;
        this.y = 0;
    }

    isMoving() {
        return this.x === 0 && this.y === 0;
    }
}