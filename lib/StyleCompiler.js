"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ShadowCss_1 = require("./css/ShadowCss");
exports.HOST_ATTR = 'data-_host-';
exports.CONTENT_ATTR = 'data-_content-';
class StyleCompiler {
    constructor() {
        this.shadowCss = new ShadowCss_1.ShadowCss();
    }
    compileStyles(styles, shim, uuid) {
        if (!styles) {
            return '';
        }
        const stylesString = styles.join('');
        if (!shim) {
            return stylesString;
        }
        return this.shadowCss.shimCssText(stylesString, exports.CONTENT_ATTR + uuid, exports.HOST_ATTR + uuid);
    }
}
exports.StyleCompiler = StyleCompiler;
exports.default = new StyleCompiler();
