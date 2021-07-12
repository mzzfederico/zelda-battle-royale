import Scene from "../Scene";

export default class System {
    $scene: Scene;

    registerScene(parentScene: Scene) {
        this.$scene = parentScene;
    }

    update(time, entities): void {
        /* Runs the system on each frame */
    }

    start(entities): void {
        /* Runs the system on start */
    }

    cleanup(entity): void {
        /* Handles cleanup of entity after remotion */
    }

    end(entities): void {
        /* Handles cleanup after unmount of scene */
    }
}