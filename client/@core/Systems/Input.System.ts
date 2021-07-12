import System from ".";
import Input from "../Components/Input.Component";
import Entity from "../Entities";

export default class InputManager extends System {
    inputs = {};

    update(time: number, entities: Entity[]): void {
        /* Gathers all keys to be watched */
        Object.entries(this.inputs).forEach(([key, { event, pressed }]) => {
            if (pressed) event(time);
        });
    }

    deleteKey(key: string): void {
        delete this.inputs[key];
    }

    registerKey(key: string, event): void {
        this.inputs = { ...this.inputs, [key]: { pressed: false, event } };
    }

    handleKeyEvent = (event): void => {
        const { key, type } = event;
        if (key in this.inputs) {
            if (type === "keydown") this.inputs[key].pressed = true;
            if (type === "keyup") this.inputs[key].pressed = false;
        }
    }

    end(): void {
        document.removeEventListener('keydown', this.handleKeyEvent);
        document.removeEventListener('keyup', this.handleKeyEvent);
    }

    start = (entities: Entity[]): void => {

        /* Gathers all keys to be watched */
        entities
            .filter((entity: Entity) => entity.getComponent(Input))
            .forEach((entity: Entity) => {
                Object.entries((entity.getComponent(Input) as Input).config).forEach(
                    ([key, event]) => this.registerKey(key, event)
                )
            });

        document.addEventListener('keydown', this.handleKeyEvent);
        document.addEventListener('keyup', this.handleKeyEvent);
    }
}
