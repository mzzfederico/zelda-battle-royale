import System from ".";
import { TILE_SIZE, ZOOM } from "../../constants";
import Position from "../Components/Position.Component";
import Sprite from "../Components/Sprite.Component";
import Entity from "../Entities";

export default class SpriteRenderer extends System {
    update(time: number, entities: Entity[]): void {
        /* Runs the system on each frame */
        entities
            .filter((entity: Entity) => entity.getComponent(Sprite))
            .forEach((entity: Entity) => {
                const { isDisabled } = entity;
                const sprite = document.getElementById(entity.id) as HTMLImageElement;
                if (!isDisabled) this.updateSprite(sprite, entity);
                if (isDisabled) this.hideSprite(sprite);
            });
    }

    start = (entities: Entity[]): void => {
        /* Runs the system on start */
        entities
            .filter((entity: Entity) => !!entity.getComponent(Sprite))
            .forEach((entity: Entity) => {
                const sprite = document.createElement("img");
                this.updateSprite(sprite, entity);
                document.getElementById("root").append(sprite);
            });
    }

    updateSprite = (sprite: HTMLImageElement, entity: Entity): void => {
        if (entity.id) sprite.setAttribute("id", entity.id);

        const { x, y } = entity.getComponent(Position) as Position;
        const { src, width, height } = entity.getComponent(Sprite) as Sprite;

        sprite.classList.add(entity.tag);

        sprite.style.position = 'absolute';

        sprite.style.left = `${Math.floor(x * ZOOM * TILE_SIZE)}px`;
        sprite.style.top = `${Math.floor(y * ZOOM * TILE_SIZE)}px`;

        sprite.style.width = `${Math.floor(width * ZOOM * TILE_SIZE)}px`;
        sprite.style.height = `${Math.floor(height * ZOOM * TILE_SIZE)}px`;
        sprite.style.display = "block";

        sprite.src = src;
    }

    hideSprite(sprite: HTMLImageElement): void {
        sprite.style.display = "none";
    }
}