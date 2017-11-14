"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_dom_1 = require("react-dom");
class ReactShadow extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            shadowRoot: null
        };
    }
    componentDidMount() {
        const root = react_dom_1.findDOMNode(this).attachShadow({ mode: 'open', delegatesFocus: false });
        const shadowRoot = root.appendChild(document.createElement('div'));
        react_dom_1.render(react_1.Children.only(this.props.children), shadowRoot);
        this.setState({ shadowRoot });
    }
    componentDidUpdate() {
        react_dom_1.render(react_1.Children.only(this.props.children), this.state.shadowRoot);
    }
    render() {
        return react_1.default.createElement("div", null);
    }
}
exports.default = ReactShadow;
