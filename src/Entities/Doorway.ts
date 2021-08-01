import Collider from "__Components/Collider.Component";
import Entity from "__Core/Entity";
import Sprite from "../../../engine/Components/Sprite.Component";

export enum DoorwayDirection {
    Top,
    Right,
    Bottom,
    Left
}

export default class Doorway extends Entity {
    constructor({ x = 0, y = 1, direction = DoorwayDirection.Top, handleEntry }: DoorwayProps) {
        super({ tag: "doorway", x, y });

        let width = 1;
        let height = 1;
        if (direction === DoorwayDirection.Top || direction === DoorwayDirection.Bottom) width = 2, height = 0.1;
        if (direction === DoorwayDirection.Left || direction === DoorwayDirection.Right) width = 0.1, height = 2;

        this.addComponent(new Collider({
            width, height, isRigid: true, onCollision: (target) => (target.tag === "player") ? handleEntry(direction) : null
        }));

        this.addComponent(new Sprite({
            src: "",
            width,
            height
        }));

        this.direction = direction;
    }

    direction: DoorwayDirection = 0;
}

type DoorwayProps = {
    x: number;
    y: number;
    direction: DoorwayDirection;
    handleEntry?: (target: any) => void;
}