import System from "../@core/Systems";

export default class SystemDebugPlayer extends System {
    update(time, entities) {
        entities
            .filter(entity => entity.id === "player")
            .forEach(({ components }) => {
                if (components.health) {
                    const meter = document.getElementById("player-health-meter");
                    meter.textContent = `${JSON.stringify(components, null, 4)}`;
                }
            });
    }

    start() {
        const meter = document.createElement("pre");
        meter.setAttribute("id", "player-health-meter");
        document.getElementById("root").append(meter);
    }
}