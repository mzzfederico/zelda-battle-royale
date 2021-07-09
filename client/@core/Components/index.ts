export default class Component {
    name: string;
    entityId: string;

    registerEntityId(id: string): void {
        this.entityId = id;
    }
}