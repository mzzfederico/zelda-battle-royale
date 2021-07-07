export default class Component {
    name: string;
    entityId: string;

    constructor({ name }) {
        this.name = name;
    }

    registerEntityId(id: string): void {
        this.entityId = id;
    }
}