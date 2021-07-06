import System from ".";

export default class InputManager extends System {
    inputs = {};

    update(time, entities) {
        /* Gathers all keys to be watched */
        Object.entries(this.inputs).forEach(([key, { event, pressed }]) => {
            if (pressed) event(time);
        });
    }

    deleteKey(key): void {
        delete this.inputs[key];
    }

    registerKey(key, event): void {
        this.inputs = { ...this.inputs, [key]: { pressed: false, event } };
    }

    handleKeyEvent = (event): void => {
        const { key, type } = event;
        if (type === "keydown") this.inputs[key].pressed = true;
        if (type === "keyup") this.inputs[key].pressed = false;
    }

    destroy(): void {
        document.removeEventListener('keydown', this.handleKeyEvent);
        document.removeEventListener('keyup', this.handleKeyEvent);
    }

    start = (entities): void => {

        /* Gathers all keys to be watched */
        entities
            .filter(({ components }) => components.input)
            .forEach(({ components }) => {
                Object.entries(components.input.config).forEach(
                    ([key, event]) => this.registerKey(key, event)
                )
            });

        document.addEventListener('keydown', this.handleKeyEvent);
        document.addEventListener('keyup', this.handleKeyEvent);
    }
}
