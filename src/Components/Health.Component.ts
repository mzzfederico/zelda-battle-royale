import Component from "__Core/Component";

export default class Health extends Component {
    value: number = 3;
    invincibleTime: number = 0;

    constructor(initialHealth: number = 3) {
        super();
        this.value = initialHealth;
    }

    incrementHealth(value) {
        this.value += value;
    }

    decrementHealth(value) {
        this.value -= value;
    }
}