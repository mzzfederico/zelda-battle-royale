import Collider from "../../../engine/Components/Collider.Component";
import Movement from "../../../engine/Components/Movement.Component";
import PositionOffset from "../../../engine/Components/PositionOffset.Component";
import Relationship from "../../../engine/Components/Relationship.Component";
import Sprite from "../../../engine/Components/Sprite.Component";
import Entity from "../../../engine/Entity";
import { Coordinate2d } from "../../../engine/Types/Coordinate2d";
import Health from "../Components/Health.Component";
import { PlayerDirection } from "./Player";

export default class Sword extends Entity {
    swordDamage: number = 1;

    constructor({ owner, direction, tag = "sword", posSize }: ISwordProps) {
        super({ tag: `${tag}/${direction}`, isDisabled: true });
        const { x, y, height, width } = posSize;

        const sprite = new Sprite({ src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", width, height });
        const collider = new Collider({
            isEnabled: false, width, height,
            onCollision: this.handleWeaponCollision
        });
        const positionOffset = new PositionOffset({ x, y });
        const relationship = new Relationship({ parent: owner });

        this.addComponent(sprite);
        this.addComponent(collider);
        this.addComponent(relationship);
        this.addComponent(positionOffset);
    }

    handleWeaponCollision(target: Entity, tag, direction: Coordinate2d) {
        if (tag !== "enemy") return;
        const health: Health = (target.getComponent(Health) as Health);
        const movement: Movement = (target.getComponent(Movement) as Movement);

        if (!health.invincibleTime) {
            const { x, y } = direction;
            health.decrementHealth(this.swordDamage);
            movement.setSpeed(x * 0.10, y * 0.10);
            health.invincibleTime = 500;
            return;
        }
    }
}

interface ISwordProps {
    tag?: string;
    owner: string;
    direction: PlayerDirection;
    posSize: { x: number, y: number, height: number, width: number }
}