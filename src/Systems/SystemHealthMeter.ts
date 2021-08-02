import System from "__Core/System";

import Health from "../Components/Health.Component";
import coinSrc from "../Sprites/coin/coin.png";

export default class SystemHealthMeter extends System {
    htmlMeter: HTMLDivElement;
    count: number = 0;

    start() {
        if (document.getElementById("player-health-meter")) return;
        if (this.htmlMeter) return;
        this.count = 0;

        this.htmlMeter = document.createElement("div");
        this.htmlMeter.setAttribute("id", "player-health-meter");
        document.getElementById("root").prepend(this.htmlMeter);
    }

    update(time, entities) {
        const player = entities.find(entity => entity.tag === "player");
        if (player) {
            if (player.getComponent(Health)) {
                if (this.count >= player.getComponent(Health).value) {
                    this.count = player.getComponent(Health).value;
                    this.htmlMeter.innerHTML = '';

                    Array(Math.floor(this.count)).forEach(
                        () => this.htmlMeter.innerHTML += `<img class="healthIcon" src="${coinSrc}"/>`
                    );
                }
            }
        }
    }

    end() {
        this.count = 0;
        this.htmlMeter.remove();
    }
}