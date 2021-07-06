import System from ".";
import { TILE_SIZE, ZOOM } from "../../constants";

export default class SpriteRenderer extends System {
    update(time, entities): void {
        /* Runs the system on each frame */
        entities
            .filter(entity => entity.components.sprite)
            .forEach((entity) => {
                const { id, components, isDisabled } = entity;
                const sprite = document.getElementById(id);
                if (!isDisabled) this.updateSprite(sprite, components, id);
                if (isDisabled) this.hideSprite(sprite);
            });
    }

    start(entities): void {
        /* Runs the system on start */
        entities
            .filter(entity => entity.components.sprite)
            .forEach((entity) => {
                const { id, components } = entity;
                const sprite = document.createElement("img");

                this.updateSprite(sprite, components, id);
                document.body.append(sprite);
            });
    }

    updateSprite(sprite, components, id = "") {
        if (id) sprite.setAttribute("id", id);
        const { x, y } = components.position;
        const { src, width, height } = components.sprite;

        sprite.style.position = 'absolute';

        sprite.style.left = `${Math.floor(x * ZOOM * TILE_SIZE)}px`;
        sprite.style.top = `${Math.floor(y * ZOOM * TILE_SIZE)}px`;

        sprite.style.width = `${Math.floor(width * ZOOM * TILE_SIZE)}px`;
        sprite.style.height = `${Math.floor(height * ZOOM * TILE_SIZE)}px`;
        sprite.style.display = "block";

        sprite.src = src;
    }

    hideSprite(sprite) {
        sprite.style.display = "none";
    }
}