import System from "__Core/System";

export default class SystemDebugPlayer extends System {
    update(time, entities) {
        entities
            .filter(entity => entity.tag === "player")
            .forEach(({ room, components }) => {
                const debugText = document.getElementById("player-debugText");
                debugText.textContent = `${JSON.stringify({ room, components }, null, 4)}`;
            });
    }

    start() {
        if (document.getElementById("player-debugText")) return;
        const debugText = document.createElement("pre");
        debugText.setAttribute("id", "player-debugText");
        document.getElementById("root").append(debugText);
    }

    end() {
        const meter = document.getElementById("player-debugText");
        meter.remove();
    }
}