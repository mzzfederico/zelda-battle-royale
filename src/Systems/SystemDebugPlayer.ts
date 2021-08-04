import System from "__Core/System";
import ColliderGroup from "../../../engine/Components/ColliderGroup.Component";
import EnemyBehaviour from "../Components/EnemyBehaviour.Component";
import Health from "../Components/Health.Component";

export default class SystemDebugPlayer extends System {
    debugText: HTMLPreElement;

    update(time, entities) {
        entities
            .filter(entity => entity)
            .forEach((entity) => {
                this.debugText.textContent = `${JSON.stringify({ b: entity.getComponent(ColliderGroup) }, null, 4)}`;
            });
    }

    start() {
        if (this.debugText) return;
        this.debugText = document.createElement("pre");
        this.debugText.setAttribute("id", "player-debugText");
        document.getElementById("root").append(this.debugText);
    }

    end() {
        this.debugText.remove();
    }
}