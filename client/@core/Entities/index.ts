import Component from "../Components";
import Position from "../Components/Position.Component";
import { v4 as uuidv4 } from 'uuid';

export default class Entity {
    id: string;
    tag: string;
    components: Object;
    isDisabled: boolean;

    constructor({ id = uuidv4(), x = 0, y = 0, tag = "", components = {}, isDisabled = false }: IEntityProps) {
        this.id = id;
        this.tag = tag;
        this.components = { ...components };
        this.isDisabled = isDisabled;
        /* Default components */
        this.addComponent(new Position({ x, y }));
    }

    getComponent(componentName: string): Component {
        return this.components[componentName];
    }

    addComponent(component: Component): Entity {
        this.components[component.name] = component;
        component.registerEntityId(this.id);
        return this;
    }

    removeComponent(component: Component): Entity {
        delete this.components[component.name];
        return this;
    }

    setDisabled(newState: boolean): void {
        this.isDisabled = newState;
    }
}

interface IEntityProps {
    id?: string;
    tag?: string;
    x?: number;
    y?: number;
    components?: Object;
    isDisabled?: boolean;
}