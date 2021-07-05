export default class Tileset {
    src: string;
    w: number;
    h: number;
    tileSize: number;

    constructor({ src = "", width = 11, height = 3, tileSize = 16 }) {
        this.src = src;
        this.w = width;
        this.h = height;
        this.tileSize = tileSize;
    }
}