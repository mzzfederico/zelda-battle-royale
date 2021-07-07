import Position from "../Components/Position.Component";

export default class Entity {
    id: string;
    components: Object;
    isDisabled: boolean;

    constructor({ id = "", x = 0, y = 0, components = {}, isDisabled = false }: IEntityProps) {
        this.id = id;
        this.components = { ...components };
        this.isDisabled = isDisabled;
        /* Default components */
        this.addComponent(new Position({ x, y }));
    }

    getComponent(componentName) {
        return this.components[componentName];
    }

    addComponent(component): Entity {
        this.components[component.name] = component;
        component.registerParentEntity(this);
        return this;
    }

    removeComponent(component): Entity {
        delete this.components[component.name];
        return this;
    }

    setDisabled(newState: boolean): void {
        this.isDisabled = newState;
    }
}

interface IEntityProps {
    id?: string;
    x?: number;
    y?: number;
    components?: Object;
    isDisabled?: boolean;
}