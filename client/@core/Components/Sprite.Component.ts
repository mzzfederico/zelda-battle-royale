import Component from ".";

export default class Sprite extends Component {
    src: string;
    width: number;
    height: number;

    constructor({ src, width = 1, height = 1 }) {
        super({ name: "sprite" });

        this.src = src;
        this.width = width;
        this.height = height;
    }

    replaceSource(src) {
        this.src = src;
    }
}