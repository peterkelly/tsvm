// Copyright 2016 Peter Kelly <peter@pmkelly.net>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

function isIdStart(c: string): boolean {
    return (((c >= "A") && (c <= "Z")) ||
            ((c >= "a") && (c <= "z")) ||
            (c == "_"));
}

function isIdChar(c: string): boolean {
    return (isIdStart(c) || ((c >= "0") && (c <= "9")));
}

class Parser {
    public text: string;
    public pos: number;
    public len: number;

    public constructor(text: string) {
        this.text = text;
        this.pos = 0;
        this.len = this.text.length;
    }

    public skipWhitespace(): void {
        // FIXME: comments, tabs, and other whitespace characters
        while ((this.pos < this.len) && ((this.text[this.pos] == " ") || (this.text[this.pos] == "\n")))
            this.pos++;
    }

    public lookahead(str: string): boolean {
        if ((this.pos < this.len) && (this.text.substring(this.pos,this.pos + str.length) == str))
            return true;
        return false;
    }

    // FIXME: This should be replaced with matchToken(), which matches a full token as specified
    // in the lexical syntax, so that we avoid calls like match("==") which would return true even
    // if the text at this.pos is "===". The same applies to lookahead() and expect().
    public match(str: string): boolean {
        if (this.lookahead(str)) {
            this.pos += str.length;
            return true;
        }
        return false;
    }

    public expect(str: string): void {
        if (!this.match(str))
            throw new ParseError(this,this.pos,"Expected "+str);
    }

    public lookaheadKeyword(keyword: string): boolean {
        if ((this.pos < this.len) && (this.text.substring(this.pos,this.pos + keyword.length) == keyword)) {
            if ((this.pos + keyword.length == this.len) || !isIdChar(this.text[this.pos + keyword.length]))
                return true;
        }
        return false;
    }

    public matchKeyword(keyword: string): boolean {
        if (this.lookaheadKeyword(keyword)) {
            this.pos += keyword.length;
            return true;
        }
        return false;
    }

    public expectKeyword(keyword: string): void {
        if (!this.matchKeyword(keyword))
            throw new ParseError(this,this.pos,"Expected "+keyword);
    }
}

class ParseError {
    public readonly parser: Parser;
    public readonly pos: number;
    public readonly message: string;
    public constructor(parser: Parser, pos: number, message: string) {
        this.parser = parser;
        this.pos = pos;
        this.message = message;
    }
    public toString(): string {
        const before = this.parser.text.substring(0,this.pos);
        const after = this.parser.text.substring(this.pos,this.parser.text.length);
        return this.message+": "+JSON.stringify(before+"|"+after);
    }
}

const allAnnotations: string[] = [];

class Item {
    public params: string[] = [];
    public opt: boolean = false;
    public constructor() {
    }
    public suffixString(): string {
        let str = "";
        if (this.params.length > 0)
            str += "["+this.params.join(", ")+"]";
        if (this.opt)
            str += "#opt";
        return str;
    }
}

class NonterminalItem extends Item {
    public readonly name: string;
    public constructor(name: string) {
        super();
        this.name = name;
    }
    public toString(): string {
        return this.name+this.suffixString();
    }
}

class TerminalItem extends Item {
    public readonly name: string;
    public constructor(name: string) {
        super();
        this.name = name;
    }
    public toString(): string {
        return JSON.stringify(this.name)+this.suffixString();
    }
}

class GenericAnnotationItem extends Item {
    public readonly str: string;
    public constructor(str: string) {
        super();
        this.str = str;
        allAnnotations.push(str);
    }
    public toString(): string {
        return "Annotation("+this.str+")";
    }
}

abstract class AnnotationItem extends Item {
    public constructor() {
        super();
    }
}

class ParamSetAnnotationItem extends AnnotationItem {
    public readonly param: string;
    public constructor(param: string) {
        super();
        this.param = param;
    }
    public toString(): string {
        return "ParamSet("+this.param+")";
    }
}

class ParamNotSetAnnotationItem extends AnnotationItem {
    public readonly param: string;
    public constructor(param: string) {
        super();
        this.param = param;
    }
    public toString(): string {
        return "ParamNotSet("+this.param+")";
    }
}

class EmptyAnnotationItem extends AnnotationItem {
    public constructor() {
        super();
    }
    public toString(): string {
        return "Empty()";
    }
}

class LookaheadNotInAnnotationItem extends AnnotationItem {
    public readonly tokens: string[];
    public constructor(tokens: string[]) {
        super();
        this.tokens = tokens
    }
    public toString(): string {
        return "LookaheadNotIn("+JSON.stringify(this.tokens)+")";
    }
}

class NoLineTerminatorAnnotationItem extends AnnotationItem {
    public constructor() {
        super();
    }
    public toString(): string {
        return "NoLineTerminator()";
    }
}













class SpecialCharItem extends Item {
    public readonly char: string;
    public constructor(char: string) {
        super();
        this.char = char;
    }
    public toString(): string {
        return "Char("+this.char+")";
    }
}

class Sequence {
    public readonly items: Item[];
    public constructor() {
        this.items = [];
    }
    public toString(): string {
        const components: string[] = [];
        for (const item of this.items)
            components.push(""+item);
        return components.join(" ");
    }
}

class Production {
    public readonly name: string;
    public readonly params: string[];
    public readonly alternatives: Sequence[];
    public constructor(name: string, paramStr: string, params: string[]) {
        this.name = name;
        this.params = params;
        this.alternatives = [];
    }
}

class Grammar {
    public readonly productionsByName: { [name: string]: Production }
    public readonly productionArray: Production[];
    public constructor() {
        this.productionsByName = {};
        this.productionArray = [];
    }
    public addProduction(prod: Production) {
        this.productionsByName[prod.name] = prod;
        this.productionArray.push(prod);
    }
    public getProduction(name: string): Production {
        return this.productionsByName[name];
    }
    public toString(): string {
        const lines: string[] = [];
        for (const prod of this.productionArray) {
            if (prod.params.length > 0)
                lines.push(prod.name+paramsToString(prod.params)+":");
            else
                lines.push(prod.name+":");
            for (const seq of prod.alternatives) {
                lines.push("    "+seq.toString());
            }
            lines.push("");
        }
        return lines.join("\n");
    }
}

function paramsToString(params: string[]) {
    return "["+params.join(", ")+"]";
}

function parseParams(str: string): string[] {
    if (str == null)
        return [];
    if ((str.length < 2) || (str[0] != "[") || (str[str.length-1] != "]"))
        throw new Error("Param string "+JSON.stringify(str)+" must be of the form [ ... ]");
    str = str.substring(1,str.length-1);
    const untrimmed = str.split(/,/);
    const trimmed = untrimmed.map((s) => s.trim());
    return trimmed;
}

function main() {
    let nodes = 0;
    const grammar = new Grammar();
    console.log("HTMLExtract");
    visit(document.body);
    console.log("================================================================================");
    console.log(""+grammar);
    let inSyntacticGrammar = false;
    console.log("All annotations:");
    for (const ann of allAnnotations) {
        console.log(ann);
    }

    function getNodeText(root: Node) {
        const components: string[] = [];
        recurse(root);
        return components.join("");

        function recurse(node: Node) {
            if (node instanceof Text) {
                components.push(node.nodeValue);
            }
            else {
                for (let child = node.firstChild; child != null; child = child.nextSibling)
                    recurse(child);
            }
        }
    }

    function getChildElements(parent: Node): HTMLElement[] {
        const elements: HTMLElement[] = [];
        for (let child = parent.firstChild; child != null; child = child.nextSibling) {
            if (child instanceof HTMLElement)
                elements.push(child);
        }
        return elements;
    }

    function isElem(node: Node, name: string, cls: string) {
        return ((node instanceof HTMLElement) && (node.nodeName.toLowerCase() == name) && (node.getAttribute("class") == cls));
    }

    function visitGrammarProduction(gp: HTMLDivElement) {
        const children = getChildElements(gp);
        let name: string = null;
        // let params: string = null;
        let foundGeq: boolean = false;

        if ((children.length == 0) || !isElem(children[0],"div","lhs"))
            throw new Error("LHS not found");

        const lhsChildren = getChildElements(children[0]);
        // console.log("lhsChildren.length = "+lhsChildren.length);

        let ntElem: HTMLElement = null;
        let paramsElem: HTMLElement = null;
        let geqElem: HTMLElement = null;
        let grhsmodElem: HTMLElement = null;
        for (let lhsChild of lhsChildren) {
            if (isElem(lhsChild,"span","nt")) {
                ntElem = lhsChild;
                name = getNodeText(ntElem);
            }
            else if (isElem(lhsChild,"sub","g-params"))
                paramsElem = lhsChild;
            else if (isElem(lhsChild,"span","geq"))
                geqElem = lhsChild;
            else if (isElem(lhsChild,"span","grhsmod"))
                grhsmodElem = lhsChild;
            else {
                const prefix = (name != null) ? name+": " : "";
                throw new Error(prefix+"Unexpected child element of lhs: "+lhsChild.outerHTML);
            }
        }

        if (ntElem == null)
            throw new Error("Cannot find nt elem");
        // if (paramsElem == null)
        //     throw new Error(name+": Cannot find params elem");
        if (geqElem == null)
            throw new Error(name+": Cannot find geq elem");
        if (grhsmodElem != null) {
            console.log("SKIPPING "+name+": "+getNodeText(grhsmodElem));
            return;
        }
        if (grammar.getProduction(name) != null)
            throw new Error(name+": Duplicate definition");

        const paramStr = (paramsElem == null) ? null : getNodeText(paramsElem);
        const params = parseParams(paramStr);
        const production = new Production(name,paramStr,parseParams(paramStr));
        grammar.addProduction(production);

        for (let rhsIndex = 1; rhsIndex < children.length; rhsIndex++) {
            if (!isElem(children[rhsIndex],"div","rhs"))
                throw new Error("Non-RHS found");
            try {
                production.alternatives.push(parseSequence(children[rhsIndex]));
            }
            catch (e) {
                throw new Error(name+" alternative "+rhsIndex+": "+e);
            }
        }

        // console.log(name+": Production ok");
    }

    function parseSequence(rhs: HTMLElement) {
        const sequence = new Sequence();
        const children = getChildElements(rhs);

        if (children.length == 0) {
            const allText = getNodeText(rhs);
            const components = allText.split(/ +/);
            // console.log("components = ",JSON.stringify(components));
            for (const text of components) {
                if ((text.length >= 2) && (text[0] == "<") && (text[text.length-1] == ">")) {
                    sequence.items.push(new SpecialCharItem(text.substring(1,text.length-1)));
                }
            }
            return sequence;
        }

        let i = 0;
        while (i < children.length) {
            if (isElem(children[i],"span","nt") || isElem(children[i],"code","t")) {
                const type = children[i].getAttribute("class");
                const name = getNodeText(children[i]);
                i++;

                let paramStr: string = null;
                if (isElem(children[i],"sub","g-params")) {
                    paramStr = getNodeText(children[i]);
                    i++;
                }

                let opt: boolean = false;
                if (isElem(children[i],"sub","g-opt")) {
                    opt = true;
                    i++;
                }

                let item: Item = null;
                if (type == "nt")
                    item = new NonterminalItem(name);
                else
                    item = new TerminalItem(name);
                item.params = parseParams(paramStr);
                item.opt = opt;
                sequence.items.push(item);
            }
            else if (isElem(children[i],"span","grhsmod")) {
                throw new Error("Unsupported sequence element: grhsmod");
            }
            else if (isElem(children[i],"span","grhsannot")) {
                // sequence.items.push(new GenericAnnotationItem(getNodeText(children[i])));
                sequence.items.push(parseAnnotation(getNodeText(children[i])));
                i++;
            }
            else if (isElem(children[i],"span","gprose")) {
                throw new Error("Unsupported sequence element: grhsmod");
            }
            else {
                throw new Error("Unknown sequence element: "+children[i].outerHTML);
                // FIXME: handle grhsmod, grhsannot
                // i++;
            }
        }
        return sequence;
    }

    function visit(n: Node) {
        nodes++;
        if (nodes % 1000 == 0) {
            // console.log("nodes = "+nodes);
        }
        // if (n instanceof HTMLElement) {
        //     const id = n.getAttribute("id");
        //     if (id == "sec-ecmascript-language-expressions")
        //         inSyntacticGrammar = true;
        //     else if (id == "sec-error-handling-and-language-extensions")
        //         inSyntacticGrammar = false;
        // }
        if (/*inSyntacticGrammar && */(n instanceof HTMLDivElement)) {
            const cls = n.getAttribute("class");
            if (cls == "gp") {
                let prev = n.previousSibling;
                while (prev != null) {
                    if ((prev instanceof HTMLElement) && (prev.getAttribute("class") != "gp")) {
                        if (((prev instanceof HTMLHeadingElement) || (prev instanceof HTMLParagraphElement)) &&
                            (getNodeText(prev) == "Syntax")) {
                            try {
                                visitGrammarProduction(n);
                            }
                            catch (e) {
                                console.log(e.toString());
                            }
                        }
                        break;
                    }
                    prev = prev.previousSibling;
                }
                return;
            }
        }
        for (let child = n.firstChild; child != null; child = child.nextSibling) {
            visit(child);
        }
    }

}

main();



function Identifier(p: Parser): string {
    const start = p.pos;
    try {
        if ((p.pos < p.len) && isIdStart(p.text[p.pos])) {
            p.pos++;
            while ((p.pos < p.len) && isIdChar(p.text[p.pos]))
                p.pos++;
            return p.text.substring(start,p.pos);
        }
        else {
            throw new ParseError(p,p.pos,"Expected Identifier");
        }
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}


function ParamSetAnnotation(p: Parser): AnnotationItem {
    const start = p.pos;
    try {
        p.expect("[");
        p.skipWhitespace();
        p.expect("+");
        p.skipWhitespace();
        const ident = Identifier(p);
        p.skipWhitespace();
        p.expect("]");
        return new ParamSetAnnotationItem(ident);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

function ParamNotSetAnnotation(p: Parser): AnnotationItem {
    const start = p.pos;
    try {
        p.expect("[");
        p.skipWhitespace();
        p.expect("~");
        p.skipWhitespace();
        const ident = Identifier(p);
        p.skipWhitespace();
        p.expect("]");
        return new ParamNotSetAnnotationItem(ident);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

function EmptyAnnotation(p: Parser): AnnotationItem {
    const start = p.pos;
    try {
        p.expect("[");
        p.skipWhitespace();
        p.expectKeyword("empty");
        p.skipWhitespace();
        p.expect("]");
        return new EmptyAnnotationItem();
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

function LookaheadNotInAnnotation(p: Parser): AnnotationItem {
    const start = p.pos;
    try {
        p.expect("[");
        p.skipWhitespace();

        p.expectKeyword("lookahead");
        p.skipWhitespace();

        const tokens: string[] = [];

        if (p.match("≠")) {
            p.skipWhitespace();
            const tokenStart = p.pos;
            while ((p.pos < p.len) && (p.text[p.pos] != " "))
                p.pos++;
            if (p.pos == tokenStart)
                throw new ParseError(p,p.pos,"Expected token");
            tokens.push(p.text.substring(tokenStart,p.pos));
        }
        else if (p.match("∉")) {
            p.skipWhitespace();
            p.expect("{");
            p.skipWhitespace();

            while (true) {
                const tokenStart = p.pos;
                while ((p.pos < p.len) && (p.text[p.pos] != " ") && (p.text[p.pos] != "}") && (p.text[p.pos] != ","))
                    p.pos++;
                if (p.pos == tokenStart) {
                    p.pos = tokenStart;
                    break;
                }
                tokens.push(p.text.substring(tokenStart,p.pos));
                p.skipWhitespace();
                if (!p.match(","))
                    break;
                p.skipWhitespace();
            }

            p.expect("}");
        }
        else {
            throw new ParseError(p,p.pos,"Expected ≠ or ∉");
        }

        p.skipWhitespace();
        p.expect("]");
        return new LookaheadNotInAnnotationItem(tokens);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

function NoLineTerminatorAnnotation(p: Parser): AnnotationItem {
    // [no LineTerminator here]
    const start = p.pos;
    try {
        p.expect("[");
        p.skipWhitespace();
        p.expectKeyword("no");
        p.skipWhitespace();
        p.expectKeyword("LineTerminator");
        p.skipWhitespace();
        p.expectKeyword("here");
        p.skipWhitespace();
        p.expect("]");
        return new NoLineTerminatorAnnotationItem();
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

function parseAnnotation(annotationStr: string): AnnotationItem {
    const p = new Parser(annotationStr);
    try { return ParamSetAnnotation(p); } catch (e) {}
    try { return ParamNotSetAnnotation(p); } catch (e) {}
    try { return EmptyAnnotation(p); } catch (e) {}
    try { return LookaheadNotInAnnotation(p); } catch (e) {}
    try { return NoLineTerminatorAnnotation(p); } catch (e) {}
    throw new Error("Invalid annotation: "+JSON.stringify(annotationStr));
}
