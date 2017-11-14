"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShadowCss_1 = require("./css/ShadowCss");
exports.HOST_ATTR = 'data-_host-';
exports.CONTENT_ATTR = 'data-_content-';
var StyleCompiler = (function () {
    function StyleCompiler() {
        this.shadowCss = new ShadowCss_1.ShadowCss();
    }
    StyleCompiler.prototype.compileStyles = function (styles, shim, uuid) {
        if (!styles) {
            return '';
        }
        var stylesString = styles.join('');
        if (!shim) {
            return stylesString;
        }
        return this.shadowCss.shimCssText(stylesString, exports.CONTENT_ATTR + uuid, exports.HOST_ATTR + uuid);
    };
    return StyleCompiler;
}());
exports.StyleCompiler = StyleCompiler;
exports.default = new StyleCompiler();
