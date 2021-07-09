import System from ".";
import { ZOOM } from "../../constants";
import Position from "../Components/Position.Component";
import Tilemap from "../Components/Tilemap.Component";

import { drawTileMap } from "../Utils/canvasRendering";

export default class CanvasRenderer extends System {
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
            .filter(entity => !!entity.getComponent(Tilemap) && !!entity.getComponent(Position))
            .forEach(
                (entity) => {
                    const tilemap = entity.getComponent(Tilemap) as Tilemap;
                    const position = entity.getComponent(Position) as Position;
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

        document.getElementById("root").append(canvas);
    }
}