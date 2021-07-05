import System from "../@core/Systems";

export default class SystemHealthMeter extends System {
    update(time, entities) {
        entities
            .filter(entity => entity.id === "player")
            .forEach(({ components }) => {
                if (components.health) {
                    const meter = document.getElementById("player-health-meter");
                    meter.textContent = `Health: ${components.health.value}`;
                }
            });
    }

    start() {
        const meter = document.createElement("div");
        meter.setAttribute("id", "player-health-meter");
        document.body.append(meter);
    }
}