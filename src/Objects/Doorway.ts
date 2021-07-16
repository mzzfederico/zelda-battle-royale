import Collider from "__Components/Collider.Component";
import Entity from "__Core/Entity";

export enum DoorwayDirection {
    Vertical,
    Horizontal,
}

export default class Doorway extends Entity {
    constructor({ x = 0, y = 1, direction = DoorwayDirection.Horizontal }: DoorwayProps) {
        super({ tag: "doorway", x, y });

        let width = 1;
        let height = 1;
        if (direction === DoorwayDirection.Vertical) width = 0.1, height = 2;
        if (direction === DoorwayDirection.Horizontal) width = 2, height = 0.1;

        this.addComponent(new Collider({ width, height, isRigid: true }));
    }
}

type DoorwayProps = {
    x: number;
    y: number;
    direction: DoorwayDirection
}