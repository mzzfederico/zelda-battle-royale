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
                    const currentState: SpriteAnimationState = animation.getState();

                    /* Update animation clock and steps */
                    animation.updateTime(time);
                    if (animation.animationTime > currentState.interval) {
                        animation.updateStep();
                        animation.clearTime();
                    }

                    /* Update sprite source on frame change */
                    const currentSrc = sprite.src;
                    const currentFrame = animation.getCurrentFrame();

                    if (currentSrc !== currentFrame) {
                        sprite.replaceSource(currentFrame);
                    }
                }
            )
    }
}