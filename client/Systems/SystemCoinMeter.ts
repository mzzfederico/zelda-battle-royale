import System from "../@core/Systems";

import coinSrc from "../Sprites/coin/coin.png";

export default class SystemCoinMeter extends System {
    update(time, entities) {
        entities
            .filter(entity => entity.tag === "player")
            .forEach(({ components }) => {
                if (components.coins) {
                    const meter = document.getElementById("player-coins-meter");
                    if (meter.childElementCount < components.coins.value) {
                        meter.innerHTML = ``;
                        let i = 0;
                        while (i < components.coins.value) {
                            meter.innerHTML += `<img src="${coinSrc}"/>`;
                            i++;
                        }
                    }
                }
            });
    }

    start() {
        const meter = document.createElement("div");
        meter.setAttribute("id", "player-coins-meter");
        document.getElementById("root").append(meter);
    }
}