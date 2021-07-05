import System from "../@core/Systems";

import n from "../sprites/player/n.png";
import w from "../sprites/player/w.png";
import s from "../sprites/player/s.png";
import e from "../sprites/player/e.png";

export default class SystemPlayerMovement extends System {
    update(time, entities) {
        entities
            .filter(entity => entity.id === "player")
            .forEach(({ components }) => {
                components.position.transformation(
                    (x, y) => ({ x: x + 0.001, y: y + 0.001 })
                );

                /* const sprites = [n, w, s, e];

                const random = Math.floor(Math.random() * 3 + 1);

                components.sprite.replaceSource(sprites[random]); */
            });
    }

    start() {

    }
}