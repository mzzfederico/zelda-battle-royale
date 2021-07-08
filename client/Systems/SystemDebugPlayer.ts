import System from "../@core/Systems";

export default class SystemDebugPlayer extends System {
    update(time, entities) {
        entities
            .filter(entity => entity.tag === "player")
            .forEach(({ components }) => {
                const debugText = document.getElementById("player-debugText");
                debugText.textContent = `${JSON.stringify(components, null, 4)}`;
            });
    }

    start() {
        const debugText = document.createElement("pre");
        debugText.setAttribute("id", "player-debugText");
        document.getElementById("root").append(debugText);
    }
}