"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const prop_types_1 = require("prop-types");
const ReactShadow_1 = require("./ReactShadow");
const ViewEncapsulation_1 = require("./ViewEncapsulation");
const StyleCompiler_1 = require("./StyleCompiler");
const utils_1 = require("./utils");
class ReactScoped extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            currentUuid: utils_1.getUuid()
        };
        this.modifyChildren = (child) => {
            if (!child) {
                return null;
            }
            if (typeof child.type === 'string') {
                if (typeof child.props.children === 'string') {
                    return react_1.default.cloneElement(child, { [StyleCompiler_1.CONTENT_ATTR + this.state.currentUuid]: '' });
                }
                return react_1.default.cloneElement(child, {
                    [StyleCompiler_1.CONTENT_ATTR + this.state.currentUuid]: '',
                    children: react_1.default.Children.map(child.props.children, this.modifyChildren)
                });
            }
            return child;
        };
    }
    compileStyles(props) {
        const styles = StyleCompiler_1.default.compileStyles(props.styles, props.encapsulation === ViewEncapsulation_1.default.Emulated, this.state.currentUuid);
        return styles;
    }
    render() {
        const { encapsulation, children } = this.props;
        const compiledStyles = this.compileStyles(this.props);
        const styleElement = react_1.default.createElement("style", { type: "text/css", dangerouslySetInnerHTML: { __html: compiledStyles } });
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
    }
}
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
exports.default = ReactScoped;
