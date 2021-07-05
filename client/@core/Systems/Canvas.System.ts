import System from ".";
import { ZOOM } from "../../constants";

import { drawTileMap } from "../Utils/canvasRendering";

export default class SystemCanvas extends System {
    height: number = 300;
    width: number = 150;
    ctx: CanvasRenderingContext2D;

    constructor(width, height) {
        super();
        this.height = height;
        this.width = width;
    }


    /* update(time, entities): void {
    } */

    drawTilemapsFromEntities(entities) {
        entities
            .filter(entity => entity.components.tilemap)
            .forEach(
                ({ id, components }) => {
                    const { tilemap, position } = components;
                    drawTileMap(this.ctx, tilemap.map, tilemap.set, position);
                }
            );
    }

    start(entities): void {
        const canvas = document.createElement("canvas");
        this.ctx = canvas.getContext("2d");

        canvas.setAttribute('width', `${this.width * ZOOM}`);
        canvas.setAttribute('height', `${this.height * ZOOM}`);

        this.drawTilemapsFromEntities(entities);

        document.body.append(canvas);
    }
}