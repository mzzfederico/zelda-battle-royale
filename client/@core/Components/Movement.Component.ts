import Component from ".";

export default class Movement extends Component {
    x: number;
    y: number;

    constructor({ x, y }) {
        super({ name: "movement" });
        this.x = x;
        this.y = y;
    }

    setSpeed(x, y) {
        this.x = x;
        this.y = y;
    }
}