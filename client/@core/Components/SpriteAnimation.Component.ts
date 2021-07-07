import Component from ".";

export default class SpriteAnimation extends Component {
    states: SpriteAnimationState[]
    current: string;
    animationTime: number;
    animationStep: number;
    stale: booelean;

    constructor(states: SpriteAnimationState[], defaultState: string = "") {
        super({ name: "spriteAnimation" });

        this.animationStep = 0;
        this.animationTime = 0;
        this.stale = false;
        this.states = states;
        this.current = defaultState ? defaultState : states[0].name;
    }

    getState = (): SpriteAnimationState => {
        return this.states.find(searchElement => searchElement.name === this.current);
    }

    refreshImmediately = () => {
        this.stale = true;
    }

    changeState = (newState: string): string => {
        if (this.current !== newState) {
            console.log(this.current, newState);
            this.stale = true;
            this.current = newState;
        }
        return this.current;
    }

    clearTime = (): void => {
        this.animationTime = 0;
    }

    updateTime = (seconds: number): void => {
        if (isNaN(seconds)) return;
        this.animationTime += seconds;
    }

    getNextFrame = (): string => {
        const currentState: SpriteAnimationState = this.getState();

        console.log(this.animationStep);

        this.stale = false;
        this.animationStep = this.animationStep + 1;

        if (currentState.frames.length === this.animationStep) {
            this.animationStep = 0;
            this.changeState(currentState.nextState);
        }

        return currentState.frames[this.animationStep];
    }
}
export type SpriteAnimationState = {
    name: string;
    interval: number;
    frames: string[];
    nextState: string;
}