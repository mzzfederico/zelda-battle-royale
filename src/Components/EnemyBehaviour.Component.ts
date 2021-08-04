import Component from "__Core/Component";
import { Coordinate2d } from "../../../engine/Types/Coordinate2d";

export default class EnemyBehaviour extends Component {
    state: EnemyStrategies = EnemyStrategies.ReachPlayer;
    destination: Coordinate2d;
    destinationQueue: Coordinate2d[];

    constructor(initialStrategy: EnemyStrategies, destinationQueue: Coordinate2d[] = []) {
        super();
        this.state = initialStrategy;
        this.destinationQueue = destinationQueue;
    }

    setBehaviour(newBehaviour: EnemyStrategies, destinationQueue: Coordinate2d[] = []): void {
        this.state = newBehaviour;
    }
}

export enum EnemyStrategies {
    ReachPlayer,
    AlignWithPlayer,
    ReachPosition
}