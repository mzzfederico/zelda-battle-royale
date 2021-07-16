import Component from "__Core/Component";

export default class Coins extends Component {
    value: number = 0;

    constructor(initialCoins: number) {
        super();
        this.value = initialCoins;
    }

    earnCoins(value) {
        this.value += value;
    }

    spendCoins(value) {
        this.value -= value;
    }
}