import Component from ".";

export default class Collider extends Component {
    width: number;
    height: number;
    isStatic: boolean;
    onCollision: Function;

    constructor({ width, height, isStatic = false, onCollision = (target) => { } }) {
        super({ name: "collider" });

        this.width = width;
        this.height = height;
        this.isStatic = isStatic;
        this.onCollision = onCollision;
    }
}