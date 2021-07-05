import Component from ".";

export default class ComponentSprite extends Component {
    src: string;
    width: number;
    height: number;

    constructor({ src, width = 16, height = 16 }) {
        super({ name: "sprite" });

        this.src = src;
        this.width = width;
        this.height = height;
    }

    replaceSource(src) {
        this.src = src;
    }
}