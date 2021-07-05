import Component from ".";

export default class Position extends Component {
    x: number;
    y: number;

    constructor({ x, y }) {
        super({ name: "position" });

        this.x = x;
        this.y = y;
    }

    transformation(vectorFunction) {
        const { x, y } = vectorFunction(this.x, this.y);
        this.x = x;
        this.y = y;
    }
}