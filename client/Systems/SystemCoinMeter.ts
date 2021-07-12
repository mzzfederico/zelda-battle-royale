import System from "../@core/Systems";
import Coins from "../Components/Coins.Component";

import coinSrc from "../Sprites/coin/coin.png";

export default class SystemCoinMeter extends System {
    update(time, entities) {
        entities
            .filter(entity => entity.tag === "player")
            .forEach((entity) => {
                if (entity.getComponent(Coins)) {
                    const meter = document.getElementById("player-coins-meter");
                    if (meter.childElementCount < entity.getComponent(Coins).value) {
                        meter.innerHTML = ``;
                        let i = 0;
                        while (i < entity.getComponent(Coins).value) {
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

    end() {
        const meter = document.getElementById("player-coins-meter");
        meter.remove();
    }
}