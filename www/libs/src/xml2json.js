'use strict';

System.register([], function (_export, _context) {
    "use strict";

    var _createClass, XMLParser;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            _export('XMLParser', XMLParser = function () {
                function XMLParser() {
                    _classCallCheck(this, XMLParser);
                }

                _createClass(XMLParser, null, [{
                    key: 'parseHTML',
                    value: function parseHTML(html) {
                        html = html.split('&lt;').join('<');
                        html = html.split('&gt;').join('>');
                        return XMLParser.parse(html);
                    }
                }, {
                    key: 'parse',
                    value: function parse(xml) {
                        var result = {};
                        var scope = result;
                        var i, l, c, d;
                        var tagName;
                        var op = 0;
                        i = 0;
                        l = xml.length;
                        while (i < l) {
                            switch (op) {
                                case 0:
                                    c = xml.indexOf('<', i) + 1;
                                    d = XMLParser.nextCharNum(xml, c, '/', '>', ' ');
                                    tagName = xml.substring(c, d);
                                    scope['@tag'] = tagName;
                                    op = 1;
                                    i = d;
                                case 1:
                                    i = XMLParser.readAttrs(xml, i, scope);
                                    switch (xml.charAt(i)) {
                                        case '/':
                                            i++;
                                            op = 3;
                                            break;
                                        case '>':
                                            i++;
                                            op = 2;
                                    }
                                case 2:
                                    i = XMLParser.skipWhiteSpace(xml, i);
                                    switch (xml.charAt(i)) {
                                        case '<':
                                            if (xml.substr(i, 2) == '</') {
                                                i = XMLParser.nextCharNum(xml, i, '>');
                                                op = 3;
                                                break;
                                            }
                                            var nScope = { '@parent': scope };
                                            if (scope['@children']) {
                                                scope['@children'].push(nScope);
                                            } else {
                                                scope['@children'] = [nScope];
                                            }
                                            scope = nScope;
                                            op = 0;
                                            break;
                                        default:
                                            var to = XMLParser.nextCharNum(xml, i, '<');
                                            var text = xml.substring(i, to);
                                            if (scope['@children']) {
                                                scope['@children'].push(text);
                                            } else {
                                                scope['@children'] = [text];
                                            }
                                            i = to;
                                            break;
                                    }
                                    break;
                                case 3:
                                    nScope = scope['@parent'];
                                    delete scope['@parent'];
                                    scope = nScope;
                                    if (scope == null) {
                                        i = xml.length;
                                        break;
                                    }
                                    op = 2;
                                    i++;
                                    break;
                                default:
                                    i += xml.length;
                                    break;
                            }
                        }
                        return result;
                    }
                }, {
                    key: 'readAttrs',
                    value: function readAttrs(src, offset, attr) {
                        var r;
                        offset = XMLParser.skipWhiteSpace(src, offset);
                        while (src.charAt(offset) != '/' && src.charAt(offset) != '>') {
                            r = XMLParser.nextChar(src, offset + 1, ' ', '=', '/', '>');
                            var attrName = src.substring(offset, r.at);
                            switch (r.char) {
                                case '>':
                                case '/':
                                    attr[attrName] = null;
                                    return r.at;
                                case ' ':
                                    var p = XMLParser.skipWhiteSpace(src, r.at + 1);
                                    if (XMLParser.letterPattern.test(src.charAt(p))) {
                                        attr[attrName] = null;
                                        offset = r.at;
                                        break;
                                    } else if (src.charAt(p) == '=') {} else {
                                        attr[attrName] = null;
                                        offset = p;
                                        break;
                                    }
                                case '=':
                                    attrName = src.substring(offset, r.at).split(' ').join();
                                    offset = XMLParser.skipWhiteSpace(src, r.at);
                                    r = XMLParser.nextChar(src, offset, "'", '"');
                                    if (r == null) {
                                        return 0;
                                    }
                                    offset = r.at;
                                    do {
                                        offset = src.indexOf(r.char, offset + 1);
                                    } while (offset != -1 && src.charAt(offset - 1) == '\\');
                                    if (offset == -1) {
                                        return XMLParser.ParseError(102, r.at);
                                    }
                                    attr[attrName] = src.substring(r.at + 1, offset);
                                    offset++;
                                    break;
                            }
                            r = XMLParser.nextChar(src, offset, '/', '>', '"', "'");
                            offset = XMLParser.skipWhiteSpace(src, offset);
                        }
                        return offset;
                    }
                }, {
                    key: 'skipWhiteSpace',
                    value: function skipWhiteSpace(str, offset) {
                        while (offset < str.length) {
                            if (!/\s/.test(str.charAt(offset))) {
                                return offset;
                            }
                            offset++;
                        }
                        return str.length;
                    }
                }, {
                    key: 'nextChar',
                    value: function nextChar(src, offset) {
                        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                            args[_key - 2] = arguments[_key];
                        }

                        var min = Number.MAX_VALUE;
                        var at = -1;
                        for (var i = 2; i < arguments.length; i++) {
                            var r = arguments[i].constructor == RegExp ? src.search(arguments[i]) : src.indexOf(arguments[i], offset);
                            if (r != -1 && r < min) {
                                min = r;
                                at = i;
                            }
                        }
                        return at == -1 ? null : { at: min, char: arguments[at] };
                    }
                }, {
                    key: 'nextCharNum',
                    value: function nextCharNum(src, offset) {
                        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                            args[_key2 - 2] = arguments[_key2];
                        }

                        var min = Number.MAX_VALUE;
                        for (var i = 2; i < arguments.length; i++) {
                            var r = src.indexOf(arguments[i], offset);
                            min = Math.min(min, r < 0 ? Number.MAX_VALUE : r);
                        }
                        return min;
                    }
                }, {
                    key: 'isWhiteSpace',
                    value: function isWhiteSpace(s) {
                        return (/\s/.test(s)
                        );
                    }
                }, {
                    key: 'ParseError',
                    value: function ParseError(type, at) {
                        throw new Error('CharError');
                    }
                }]);

                return XMLParser;
            }());

            _export('XMLParser', XMLParser);

            XMLParser.letterPattern = /^[a-zA-Z]+$/;
        }
    };
});