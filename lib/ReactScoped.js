"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var prop_types_1 = require("prop-types");
var ReactShadow_1 = require("./ReactShadow");
var ViewEncapsulation_1 = require("./ViewEncapsulation");
var StyleCompiler_1 = require("./StyleCompiler");
var utils_1 = require("./utils");
var ReactScoped = (function (_super) {
    __extends(ReactScoped, _super);
    function ReactScoped() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            currentUuid: utils_1.getUuid()
        };
        _this.modifyChildren = function (child) {
            if (!child) {
                return null;
            }
            if (typeof child.type === 'string') {
                if (typeof child.props.children === 'string') {
                    return react_1.default.cloneElement(child, (_a = {}, _a[StyleCompiler_1.CONTENT_ATTR + _this.state.currentUuid] = '', _a));
                }
                return react_1.default.cloneElement(child, (_b = {},
                    _b[StyleCompiler_1.CONTENT_ATTR + _this.state.currentUuid] = '',
                    _b.children = react_1.default.Children.map(child.props.children, _this.modifyChildren),
                    _b));
            }
            return child;
            var _a, _b;
        };
        return _this;
    }
    ReactScoped.prototype.compileStyles = function (props) {
        var styles = StyleCompiler_1.default.compileStyles(props.styles, props.encapsulation === ViewEncapsulation_1.default.Emulated, this.state.currentUuid);
        return styles;
    };
    ReactScoped.prototype.render = function () {
        var _a = this.props, encapsulation = _a.encapsulation, children = _a.children;
        var compiledStyles = this.compileStyles(this.props);
        var styleElement = react_1.default.createElement("style", { type: "text/css", dangerouslySetInnerHTML: { __html: compiledStyles } });
        if (encapsulation === ViewEncapsulation_1.default.Native) {
            return (react_1.default.createElement(ReactShadow_1.default, null,
                react_1.default.createElement("div", null,
                    styleElement,
                    this.props.children)));
        }
        if (encapsulation === ViewEncapsulation_1.default.None) {
            return (react_1.default.createElement("div", null,
                styleElement,
                this.props.children));
        }
        return (react_1.default.createElement("div", null,
            styleElement,
            react_1.default.Children.map(children, this.modifyChildren)));
    };
    ReactScoped.propTypes = {
        style: prop_types_1.default.arrayOf(prop_types_1.default.string),
        encapsulation: prop_types_1.default.oneOf([
            ViewEncapsulation_1.default.Emulated,
            ViewEncapsulation_1.default.Native,
            ViewEncapsulation_1.default.None
        ])
    };
    ReactScoped.defaultProps = {
        styles: [],
        encapsulation: ViewEncapsulation_1.default.Emulated
    };
    return ReactScoped;
}(react_1.PureComponent));
exports.default = ReactScoped;
