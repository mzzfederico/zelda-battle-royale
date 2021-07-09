import Component from ".";

export default class Input extends Component {
    config: Object = {};

    constructor({ config }) {
        super();

        this.config = config;
    }
}