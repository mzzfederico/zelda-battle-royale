import System from ".";
import Sprite from "../Components/Sprite.Component";
import SpriteAnimation, { SpriteAnimationState } from "../Components/SpriteAnimation.Component";
import Entity from "../Entities";

export default class AnimationSystem extends System {
    update(time, entities) {
        entities
            .filter((entity) => !!entity.getComponent("spriteAnimation"))
            .forEach(
                (entity: Entity): void => {
                    const animation: SpriteAnimation = entity.getComponent("spriteAnimation");
                    const sprite: Sprite = entity.getComponent("sprite");

                    animation.updateTime(time / 1000);

                    const currentState: SpriteAnimationState = animation.getState();
                    if (animation.animationTime > currentState.interval || animation.stale) {
                        sprite.replaceSource(animation.getNextFrame());
                        animation.clearTime();
                    }
                }
            )
    }
}