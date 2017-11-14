"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShadowCss = (function () {
    function ShadowCss() {
        this.strictStyling = true;
    }
    ShadowCss.prototype.shimCssText = function (cssText, selector, hostSelector) {
        if (hostSelector === void 0) { hostSelector = ''; }
        var sourceMappingUrl = extractSourceMappingUrl(cssText);
        cssText = stripComments(cssText);
        cssText = this._insertDirectives(cssText);
        return this._scopeCssText(cssText, selector, hostSelector) + sourceMappingUrl;
    };
    ShadowCss.prototype._insertDirectives = function (cssText) {
        cssText = this._insertPolyfillDirectivesInCssText(cssText);
        return this._insertPolyfillRulesInCssText(cssText);
    };
    ShadowCss.prototype._insertPolyfillDirectivesInCssText = function (cssText) {
        return cssText.replace(_cssContentNextSelectorRe, function () {
            var m = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                m[_i] = arguments[_i];
            }
            return m[2] + '{';
        });
    };
    ShadowCss.prototype._insertPolyfillRulesInCssText = function (cssText) {
        return cssText.replace(_cssContentRuleRe, function () {
            var m = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                m[_i] = arguments[_i];
            }
            var rule = m[0].replace(m[1], '').replace(m[2], '');
            return m[4] + rule;
        });
    };
    ShadowCss.prototype._scopeCssText = function (cssText, scopeSelector, hostSelector) {
        var unscopedRules = this._extractUnscopedRulesFromCssText(cssText);
        cssText = this._insertPolyfillHostInCssText(cssText);
        cssText = this._convertColonHost(cssText);
        cssText = this._convertColonHostContext(cssText);
        cssText = this._convertShadowDOMSelectors(cssText);
        if (scopeSelector) {
            cssText = this._scopeSelectors(cssText, scopeSelector, hostSelector);
        }
        cssText = cssText + '\n' + unscopedRules;
        return cssText.trim();
    };
    ShadowCss.prototype._extractUnscopedRulesFromCssText = function (cssText) {
        var r = '';
        var m;
        _cssContentUnscopedRuleRe.lastIndex = 0;
        while ((m = _cssContentUnscopedRuleRe.exec(cssText)) !== null) {
            var rule = m[0].replace(m[2], '').replace(m[1], m[4]);
            r += rule + '\n\n';
        }
        return r;
    };
    ShadowCss.prototype._convertColonHost = function (cssText) {
        return this._convertColonRule(cssText, _cssColonHostRe, this._colonHostPartReplacer);
    };
    ShadowCss.prototype._convertColonHostContext = function (cssText) {
        return this._convertColonRule(cssText, _cssColonHostContextRe, this._colonHostContextPartReplacer);
    };
    ShadowCss.prototype._convertColonRule = function (cssText, regExp, partReplacer) {
        return cssText.replace(regExp, function () {
            var m = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                m[_i] = arguments[_i];
            }
            if (m[2]) {
                var parts = m[2].split(',');
                var r = [];
                for (var i = 0; i < parts.length; i++) {
                    var p = parts[i].trim();
                    if (!p)
                        break;
                    r.push(partReplacer(_polyfillHostNoCombinator, p, m[3]));
                }
                return r.join(',');
            }
            else {
                return _polyfillHostNoCombinator + m[3];
            }
        });
    };
    ShadowCss.prototype._colonHostContextPartReplacer = function (host, part, suffix) {
        if (part.indexOf(_polyfillHost) > -1) {
            return this._colonHostPartReplacer(host, part, suffix);
        }
        else {
            return host + part + suffix + ', ' + part + ' ' + host + suffix;
        }
    };
    ShadowCss.prototype._colonHostPartReplacer = function (host, part, suffix) {
        return host + part.replace(_polyfillHost, '') + suffix;
    };
    ShadowCss.prototype._convertShadowDOMSelectors = function (cssText) {
        return _shadowDOMSelectorsRe.reduce(function (result, pattern) { return result.replace(pattern, ' '); }, cssText);
    };
    ShadowCss.prototype._scopeSelectors = function (cssText, scopeSelector, hostSelector) {
        var _this = this;
        return processRules(cssText, function (rule) {
            var selector = rule.selector;
            var content = rule.content;
            if (rule.selector[0] != '@') {
                selector =
                    _this._scopeSelector(rule.selector, scopeSelector, hostSelector, _this.strictStyling);
            }
            else if (rule.selector.startsWith('@media') || rule.selector.startsWith('@supports') ||
                rule.selector.startsWith('@page') || rule.selector.startsWith('@document')) {
                content = _this._scopeSelectors(rule.content, scopeSelector, hostSelector);
            }
            return new CssRule(selector, content);
        });
    };
    ShadowCss.prototype._scopeSelector = function (selector, scopeSelector, hostSelector, strict) {
        var _this = this;
        return selector.split(',')
            .map(function (part) { return part.trim().split(_shadowDeepSelectors); })
            .map(function (deepParts) {
            var shallowPart = deepParts[0], otherParts = deepParts.slice(1);
            var applyScope = function (shallowPart) {
                if (_this._selectorNeedsScoping(shallowPart, scopeSelector)) {
                    return strict ?
                        _this._applyStrictSelectorScope(shallowPart, scopeSelector, hostSelector) :
                        _this._applySelectorScope(shallowPart, scopeSelector, hostSelector);
                }
                else {
                    return shallowPart;
                }
            };
            return [applyScope(shallowPart)].concat(otherParts).join(' ');
        })
            .join(', ');
    };
    ShadowCss.prototype._selectorNeedsScoping = function (selector, scopeSelector) {
        var re = this._makeScopeMatcher(scopeSelector);
        return !re.test(selector);
    };
    ShadowCss.prototype._makeScopeMatcher = function (scopeSelector) {
        var lre = /\[/g;
        var rre = /\]/g;
        scopeSelector = scopeSelector.replace(lre, '\\[').replace(rre, '\\]');
        return new RegExp('^(' + scopeSelector + ')' + _selectorReSuffix, 'm');
    };
    ShadowCss.prototype._applySelectorScope = function (selector, scopeSelector, hostSelector) {
        return this._applySimpleSelectorScope(selector, scopeSelector, hostSelector);
    };
    ShadowCss.prototype._applySimpleSelectorScope = function (selector, scopeSelector, hostSelector) {
        _polyfillHostRe.lastIndex = 0;
        if (_polyfillHostRe.test(selector)) {
            var replaceBy_1 = this.strictStyling ? "[" + hostSelector + "]" : scopeSelector;
            return selector
                .replace(_polyfillHostNoCombinatorRe, function (hnc, selector) {
                return selector.replace(/([^:]*)(:*)(.*)/, function (_, before, colon, after) {
                    return before + replaceBy_1 + colon + after;
                });
            })
                .replace(_polyfillHostRe, replaceBy_1 + ' ');
        }
        return scopeSelector + ' ' + selector;
    };
    ShadowCss.prototype._applyStrictSelectorScope = function (selector, scopeSelector, hostSelector) {
        var _this = this;
        var isRe = /\[is=([^\]]*)\]/g;
        scopeSelector = scopeSelector.replace(isRe, function (_) {
            var parts = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                parts[_i - 1] = arguments[_i];
            }
            return parts[0];
        });
        var attrName = '[' + scopeSelector + ']';
        var _scopeSelectorPart = function (p) {
            var scopedP = p.trim();
            if (!scopedP) {
                return '';
            }
            if (p.indexOf(_polyfillHostNoCombinator) > -1) {
                scopedP = _this._applySimpleSelectorScope(p, scopeSelector, hostSelector);
            }
            else {
                var t = p.replace(_polyfillHostRe, '');
                if (t.length > 0) {
                    var matches = t.match(/([^:]*)(:*)(.*)/);
                    if (matches) {
                        scopedP = matches[1] + attrName + matches[2] + matches[3];
                    }
                }
            }
            return scopedP;
        };
        var safeContent = new SafeSelector(selector);
        selector = safeContent.content();
        var scopedSelector = '';
        var startIndex = 0;
        var res;
        var sep = /( |>|\+|~(?!=))\s*/g;
        var scopeAfter = selector.indexOf(_polyfillHostNoCombinator);
        while ((res = sep.exec(selector)) !== null) {
            var separator = res[1];
            var part = selector.slice(startIndex, res.index).trim();
            var scopedPart = startIndex >= scopeAfter ? _scopeSelectorPart(part) : part;
            scopedSelector += scopedPart + " " + separator + " ";
            startIndex = sep.lastIndex;
        }
        scopedSelector += _scopeSelectorPart(selector.substring(startIndex));
        return safeContent.restore(scopedSelector);
    };
    ShadowCss.prototype._insertPolyfillHostInCssText = function (selector) {
        return selector.replace(_colonHostContextRe, _polyfillHostContext)
            .replace(_colonHostRe, _polyfillHost);
    };
    return ShadowCss;
}());
exports.ShadowCss = ShadowCss;
var SafeSelector = (function () {
    function SafeSelector(selector) {
        var _this = this;
        this.placeholders = [];
        this.index = 0;
        selector = selector.replace(/(\[[^\]]*\])/g, function (_, keep) {
            var replaceBy = "__ph-" + _this.index + "__";
            _this.placeholders.push(keep);
            _this.index++;
            return replaceBy;
        });
        this._content = selector.replace(/(:nth-[-\w]+)(\([^)]+\))/g, function (_, pseudo, exp) {
            var replaceBy = "__ph-" + _this.index + "__";
            _this.placeholders.push(exp);
            _this.index++;
            return pseudo + replaceBy;
        });
    }
    SafeSelector.prototype.restore = function (content) {
        var _this = this;
        return content.replace(/__ph-(\d+)__/g, function (ph, index) { return _this.placeholders[+index]; });
    };
    SafeSelector.prototype.content = function () { return this._content; };
    return SafeSelector;
}());
var _cssContentNextSelectorRe = /polyfill-next-selector[^}]*content:[\s]*?(['"])(.*?)\1[;\s]*}([^{]*?){/gim;
var _cssContentRuleRe = /(polyfill-rule)[^}]*(content:[\s]*(['"])(.*?)\3)[;\s]*[^}]*}/gim;
var _cssContentUnscopedRuleRe = /(polyfill-unscoped-rule)[^}]*(content:[\s]*(['"])(.*?)\3)[;\s]*[^}]*}/gim;
var _polyfillHost = '-shadowcsshost';
var _polyfillHostContext = '-shadowcsscontext';
var _parenSuffix = ')(?:\\((' +
    '(?:\\([^)(]*\\)|[^)(]*)+?' +
    ')\\))?([^,{]*)';
var _cssColonHostRe = new RegExp('(' + _polyfillHost + _parenSuffix, 'gim');
var _cssColonHostContextRe = new RegExp('(' + _polyfillHostContext + _parenSuffix, 'gim');
var _polyfillHostNoCombinator = _polyfillHost + '-no-combinator';
var _polyfillHostNoCombinatorRe = /-shadowcsshost-no-combinator([^\s]*)/;
var _shadowDOMSelectorsRe = [
    /::shadow/g,
    /::content/g,
    /\/shadow-deep\//g,
    /\/shadow\//g,
];
var _shadowDeepSelectors = /(?:>>>)|(?:\/deep\/)|(?:::ng-deep)/g;
var _selectorReSuffix = '([>\\s~+\[.,{:][\\s\\S]*)?$';
var _polyfillHostRe = /-shadowcsshost/gim;
var _colonHostRe = /:host/gim;
var _colonHostContextRe = /:host-context/gim;
var _commentRe = /\/\*\s*[\s\S]*?\*\//g;
function stripComments(input) {
    return input.replace(_commentRe, '');
}
var _sourceMappingUrlRe = /\/\*\s*#\s*sourceMappingURL=[\s\S]+?\*\//;
function extractSourceMappingUrl(input) {
    var matcher = input.match(_sourceMappingUrlRe);
    return matcher ? matcher[0] : '';
}
var _ruleRe = /(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g;
var _curlyRe = /([{}])/g;
var OPEN_CURLY = '{';
var CLOSE_CURLY = '}';
var BLOCK_PLACEHOLDER = '%BLOCK%';
var CssRule = (function () {
    function CssRule(selector, content) {
        this.selector = selector;
        this.content = content;
    }
    return CssRule;
}());
exports.CssRule = CssRule;
function processRules(input, ruleCallback) {
    var inputWithEscapedBlocks = escapeBlocks(input);
    var nextBlockIndex = 0;
    return inputWithEscapedBlocks.escapedString.replace(_ruleRe, function () {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
        }
        var selector = m[2];
        var content = '';
        var suffix = m[4];
        var contentPrefix = '';
        if (suffix && suffix.startsWith('{' + BLOCK_PLACEHOLDER)) {
            content = inputWithEscapedBlocks.blocks[nextBlockIndex++];
            suffix = suffix.substring(BLOCK_PLACEHOLDER.length + 1);
            contentPrefix = '{';
        }
        var rule = ruleCallback(new CssRule(selector, content));
        return "" + m[1] + rule.selector + m[3] + contentPrefix + rule.content + suffix;
    });
}
exports.processRules = processRules;
var StringWithEscapedBlocks = (function () {
    function StringWithEscapedBlocks(escapedString, blocks) {
        this.escapedString = escapedString;
        this.blocks = blocks;
    }
    return StringWithEscapedBlocks;
}());
function escapeBlocks(input) {
    var inputParts = input.split(_curlyRe);
    var resultParts = [];
    var escapedBlocks = [];
    var bracketCount = 0;
    var currentBlockParts = [];
    for (var partIndex = 0; partIndex < inputParts.length; partIndex++) {
        var part = inputParts[partIndex];
        if (part == CLOSE_CURLY) {
            bracketCount--;
        }
        if (bracketCount > 0) {
            currentBlockParts.push(part);
        }
        else {
            if (currentBlockParts.length > 0) {
                escapedBlocks.push(currentBlockParts.join(''));
                resultParts.push(BLOCK_PLACEHOLDER);
                currentBlockParts = [];
            }
            resultParts.push(part);
        }
        if (part == OPEN_CURLY) {
            bracketCount++;
        }
    }
    if (currentBlockParts.length > 0) {
        escapedBlocks.push(currentBlockParts.join(''));
        resultParts.push(BLOCK_PLACEHOLDER);
    }
    return new StringWithEscapedBlocks(resultParts.join(''), escapedBlocks);
}
