export default class Component {
    name: string;
    parentEntity: Object;

    constructor({ name }) {
        this.name = name;
    }

    registerParentEntity(parent) {
        this.parentEntity = parent;
    }
}