var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React, { PureComponent, Children } from 'react';
import { render, findDOMNode } from 'react-dom';
var ReactShadow = (function (_super) {
    __extends(ReactShadow, _super);
    function ReactShadow() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            shadowRoot: null
        };
        return _this;
    }
    ReactShadow.prototype.componentDidMount = function () {
        var root = findDOMNode(this).attachShadow({ mode: 'open', delegatesFocus: false });
        var shadowRoot = root.appendChild(document.createElement('div'));
        render(Children.only(this.props.children), shadowRoot);
        this.setState({ shadowRoot: shadowRoot });
    };
    ReactShadow.prototype.componentDidUpdate = function () {
        render(Children.only(this.props.children), this.state.shadowRoot);
    };
    ReactShadow.prototype.render = function () {
        return React.createElement("div", null);
    };
    return ReactShadow;
}(PureComponent));
export default ReactShadow;
