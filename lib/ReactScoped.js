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
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ShadowDOM from './ReactShadow';
import ViewEncapsulation from './ViewEncapsulation';
import styleCompiler, { CONTENT_ATTR } from './StyleCompiler';
import { getUuid } from './utils';
var ReactScoped = (function (_super) {
    __extends(ReactScoped, _super);
    function ReactScoped() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            currentUuid: getUuid()
        };
        _this.modifyChildren = function (child) {
            if (!child) {
                return null;
            }
            if (typeof child.type === 'string') {
                if (typeof child.props.children === 'string') {
                    return React.cloneElement(child, (_a = {}, _a[CONTENT_ATTR + _this.state.currentUuid] = '', _a));
                }
                return React.cloneElement(child, (_b = {},
                    _b[CONTENT_ATTR + _this.state.currentUuid] = '',
                    _b.children = React.Children.map(child.props.children, _this.modifyChildren),
                    _b));
            }
            return child;
            var _a, _b;
        };
        return _this;
    }
    ReactScoped.prototype.compileStyles = function (props) {
        var styles = styleCompiler.compileStyles(props.styles, props.encapsulation === ViewEncapsulation.Emulated, this.state.currentUuid);
        return styles;
    };
    ReactScoped.prototype.render = function () {
        var _a = this.props, encapsulation = _a.encapsulation, children = _a.children;
        var compiledStyles = this.compileStyles(this.props);
        var styleElement = React.createElement("style", { type: "text/css", dangerouslySetInnerHTML: { __html: compiledStyles } });
        if (encapsulation === ViewEncapsulation.Native) {
            return (React.createElement(ShadowDOM, null,
                React.createElement("div", null,
                    styleElement,
                    this.props.children)));
        }
        if (encapsulation === ViewEncapsulation.None) {
            return (React.createElement("div", null,
                styleElement,
                this.props.children));
        }
        return (React.createElement("div", null,
            styleElement,
            React.Children.map(children, this.modifyChildren)));
    };
    ReactScoped.propTypes = {
        style: PropTypes.arrayOf(PropTypes.string),
        encapsulation: PropTypes.oneOf([
            ViewEncapsulation.Emulated,
            ViewEncapsulation.Native,
            ViewEncapsulation.None
        ])
    };
    ReactScoped.defaultProps = {
        styles: [],
        encapsulation: ViewEncapsulation.Emulated
    };
    return ReactScoped;
}(PureComponent));
export default ReactScoped;
