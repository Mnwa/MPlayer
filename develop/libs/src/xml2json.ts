
/*  Немножко изменённый парсер XML, убрал всё лишнее 
    У этого парсера кривое API:
     В @children он хранит массив со значением элемента, а в @tag он хранит тег элемента
*/

export class XMLParser {
    public static parseHTML(html: string): Object {
        html = html.split('&lt;').join('<');
        html = html.split('&gt;').join('>');
        return XMLParser.parse(html);
    }

    public static parse(xml: string): Object {
        // init vars ; create main scope
        var result: Object = {};
        var scope: Object = result;
        var i: number, l: number, c: number, d: number;
        var tagName: string;
        var op: number = 0;
        i = 0;
        l = xml.length;
        // xml text reading through file chars ::
        while (i < l) {
            // during loop operation code changes ::
            switch (op) {
                case 0:
                    // read tag name and proceed
                    c = xml.indexOf('<', i) + 1;
                    d = XMLParser.nextCharNum(xml, c, '/', '>', ' ');
                    tagName = xml.substring(c, d);
                    scope['@tag'] = tagName;
                    op = 1;
                    i = d;
                case 1:
                    // after tag name parse read attributes ::
                    i = XMLParser.readAttrs(xml, i, scope);

                    switch (xml.charAt(i)) {// check following char for tag content or close
                        case '/':// close tag
                            i++;
                            op = 3;
                            break;
                        case '>':// continue
                            i++;
                            op = 2;
                    }
                case 2:
                    // read tag content ::
                    i = XMLParser.skipWhiteSpace(xml, i);

                    switch (xml.charAt(i)) {
                        case '<':// tag type ::
                            if (xml.substr(i, 2) == '</') {// type verification for close current tag
                                i = XMLParser.nextCharNum(xml, i, '>');
                                op = 3;// proceed to close tag
                                break;
                            }
                            // new tag found , create child scope and proceed to read attrs ::
                            var nScope: any = { '@parent': scope };
                            if (scope['@children']) {
                                scope['@children'].push(nScope);
                            } else {
                                scope['@children'] = [nScope];
                            }
                            scope = nScope;
                            op = 0;
                            break;
                        default:// end attributes
                            var to: number = XMLParser.nextCharNum(xml, i, '<');
                            var text: string = xml.substring(i, to);
                            // push text node
                            // TODO :: spaces
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
                    // tag closed ::
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


    private static letterPattern: RegExp = /^[a-zA-Z]+$/;

    private static readAttrs(src: string, offset: number, attr: Object): number {
        var r: { at: number; char: string };//= XMLParser.nextChar(src,offset,'/','>','"',"'");
        offset = XMLParser.skipWhiteSpace(src, offset);
        while (src.charAt(offset) != '/' && src.charAt(offset) != '>') {// there is attribute ::
            r = XMLParser.nextChar(src, offset + 1, ' ', '=', '/', '>');
            var attrName: string = src.substring(offset, r.at);
            switch (r.char) {
                case '>':
                case '/':
                    attr[attrName] = null;
                    return r.at;
                case ' ':
                    var p: number = XMLParser.skipWhiteSpace(src, r.at + 1);
                    //console.log('is letter ::'+XMLParser.letterPattern.test(src.charAt(p)),src.charAt(p));
                    if (XMLParser.letterPattern.test(src.charAt(p))) {
                        attr[attrName] = null;
                        offset = r.at;
                        break;
                    } else if (src.charAt(p) == '=') {
                    } else {
                        attr[attrName] = null;
                        offset = p;
                        break;
                    }
                case '=':
                    attrName = src.substring(offset, r.at).split(' ').join();
                    offset = XMLParser.skipWhiteSpace(src, r.at);
                    r = XMLParser.nextChar(src, offset, "'", '"');
                    if (r == null) {
                        //console.log('bug:',src.substr(offset - 5, 10),offset);
                        return 0;
                    }
                    offset = r.at;
                    do {
                        offset = src.indexOf(r.char, offset + 1);
                    }
                    while (offset != -1 && src.charAt(offset - 1) == '\\');

                    if (offset == -1) {
                        return XMLParser.ParseError(102, r.at);
                    }
                    attr[attrName] = src.substring(r.at + 1, offset);
                    offset++;
                    break;
            }
            r = XMLParser.nextChar(src, offset, '/', '>', '"', "'");
            offset = XMLParser.skipWhiteSpace(src, offset);
            //console.log('end attr:', r.at , r.char , src.substr(r.at,10));
        }
        return offset;
    }

    private static skipWhiteSpace(str: string, offset: number): number {
        while (offset < str.length) {
            if (!/\s/.test(str.charAt(offset))) {
                return offset;
            }
            offset++;
        }
        return str.length;
    }

    private static nextChar(src: string, offset: number, ...args): { at: number; char: string } {
        var min: number = Number.MAX_VALUE;
        var at: number = -1;
        for (var i: number = 2; i < arguments.length; i++) {
            var r: number = arguments[i].constructor == RegExp ? src.search(arguments[i]) : src.indexOf(arguments[i], offset);
            if (r != -1 && r < min) {
                min = r;
                at = i;
            }
        }
        return at == -1 ? null : { at: min, char: arguments[at] };
    }

    private static nextCharNum(src: string, offset: number, ...args): number {
        var min: number = Number.MAX_VALUE;
        for (var i: number = 2; i < arguments.length; i++) {
            var r: number = src.indexOf(arguments[i], offset);
            min = Math.min(min, r < 0 ? Number.MAX_VALUE : r);
        }
        return min;
    }



    private static isWhiteSpace(s: string): boolean {
        return /\s/.test(s);
    }

    private static ParseError(type: number, at: number): any {
        throw new Error('CharError');
    }
}
