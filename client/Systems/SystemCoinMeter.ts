import System from "../@core/Systems";

export default class SystemCoinMeter extends System {
    update(time, entities) {
        entities
            .filter(entity => entity.id === "player")
            .forEach(({ components }) => {
                if (components.coins) {
                    const meter = document.getElementById("player-coins-meter");
                    meter.textContent = `Coins: ${components.coins.value}`;
                }
            });
    }

    start() {
        const meter = document.createElement("div");
        meter.setAttribute("id", "player-coins-meter");
        document.getElementById("root").append(meter);
    }
}