import Component from ".";
import Entity from "../Entities";

export default class Collider extends Component {
    width: number;
    height: number;
    isStatic: boolean;
    isRigid: boolean;
    onCollision: Function;

    safePosition: Object;
    parentEntity: Entity;

    constructor({ width, height, isStatic = false, isRigid = false, onCollision = (target) => { } }) {
        super();

        this.width = width;
        this.height = height;
        this.isStatic = isStatic;
        this.isRigid = isRigid;
        this.onCollision = onCollision;
    }

    saveSafePosition(x: number, y: number): void {
        this.safePosition = { x, y };
    }

    getSafePosition(): Object {
        return this.safePosition;
    }
}