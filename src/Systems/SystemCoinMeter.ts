import System from "__Core/System";

import Coins from "../Components/Coins.Component";
import coinSrc from "../Sprites/coin/coin.png";

export default class SystemCoinMeter extends System {
    htmlMeter: HTMLDivElement;
    count: number = 0;

    start() {
        if (document.getElementById("player-coins-meter")) return;
        if (this.htmlMeter) return;
        this.count = 0;

        this.htmlMeter = document.createElement("div");
        this.htmlMeter.setAttribute("id", "player-coins-meter");
        document.getElementById("root").append(this.htmlMeter);
    }

    update(time, entities) {
        const player = entities.find(entity => entity.tag === "player");
        if (player) {
            if (player.getComponent(Coins)) {
                if (this.count < player.getComponent(Coins).value) {
                    this.htmlMeter.innerHTML += `<img class="coinIcon" src="${coinSrc}"/>`;
                    this.count++;
                }
            }
        }
    }

    end() {
        this.count = 0;
        this.htmlMeter.remove();
    }
}