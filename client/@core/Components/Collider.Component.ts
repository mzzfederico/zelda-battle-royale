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
        super({ name: "collider" });

        this.width = width;
        this.height = height;
        this.isStatic = isStatic;
        this.isRigid = isRigid;
        this.onCollision = onCollision;
    }

    registerParentEntity(parent) {
        this.parentEntity = parent;
        this.updateSafePosition();
    }

    updateSafePosition() {
        const { x, y } = this.parentEntity.getComponent("position");
        this.safePosition = { x, y };
    }

    restoreSafePosition() {
        this.parentEntity.getComponent("position").setPosition(this.safePosition.x, this.safePosition.y);
    }
}