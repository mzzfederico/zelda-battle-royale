import System from "__Core/System";
import Health from "__Components/Health.Component";

export default class SystemHealthMeter extends System {
    htmlMeter: HTMLDivElement;
    count: number = 0;

    start() {
        if (this.htmlMeter) return;

        this.htmlMeter = document.createElement("div");
        this.htmlMeter.setAttribute("id", "player-health-meter");
        document.getElementById("root").append(this.htmlMeter);
    }

    update(time, entities) {
        const player = entities.find(entity => entity.tag === "player");
        if (player) {
            if (player.getComponent(Health)) {
                if (this.count !== player.getComponent(Health).value) {
                    this.count = player.getComponent(Health).value;
                    this.htmlMeter.innerHTML = `${this.count}`;
                }
            }
        }
    }

    end() {
        this.count = 0;
        this.htmlMeter.remove();
    }
}