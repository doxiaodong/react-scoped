import { ShadowCss } from './css/ShadowCss';
export var HOST_ATTR = 'data-_host-';
export var CONTENT_ATTR = 'data-_content-';
var StyleCompiler = (function () {
    function StyleCompiler() {
        this.shadowCss = new ShadowCss();
    }
    StyleCompiler.prototype.compileStyles = function (styles, shim, uuid) {
        if (!styles) {
            return '';
        }
        var stylesString = styles.join('');
        if (!shim) {
            return stylesString;
        }
        return this.shadowCss.shimCssText(stylesString, CONTENT_ATTR + uuid, HOST_ATTR + uuid);
    };
    return StyleCompiler;
}());
export { StyleCompiler };
export default new StyleCompiler();
