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

import {
    isIdStart,
    isIdChar,
    isKeyword,
    Parser,
    ParseFailure,
    ParseError,
    ParseIgnore,
} from "./parser";
import {
    CastError,
    Range,
    ASTNode,
    ListNode,
    ErrorNode,
    GenericNode,
    GenericStringNode,
    GenericNumberNode,
} from "./ast";

export class Grammar {
    public productions: { [name: string]: (b: Builder) => void } = {};

    public define(name: string, fun: (b: Builder) => void) {
        if (this.productions[name] != null)
            throw new Error("Production "+name+" is already defined");
        this.productions[name] = (b: Builder) => {
            b.attempt((): void => {
                const oldLength = b.length;
                fun(b);
                b.assertLengthIs(oldLength+1);
                checkNode(b.get(0));
            });
        }
    }
    public lookup(name: string): (b: Builder) => void {
        return this.productions[name];
    }
}

export class Builder {
    public grammar: Grammar;
    public parser: Parser;
    public stack: any[] = [];
    public constructor(grammar: Grammar, parser: Parser) {
        this.grammar = grammar;
        this.parser = parser;
    }
    public get length(): number {
        return this.stack.length;
    }
    public item(f: (b: Builder) => void): void {
        f(this);
    }
    public sequence(funs: ((b: Builder) => void)[]): void {
        for (const f of funs)
            f(this);
    }
    public push(value: any): void {
        this.stack.push(value);
    }
    public pop(n: number = 1): void {
        if (n > this.stack.length)
            throw new Error("Attempt to pop past end of stack");
        this.stack.length -= n;
    }
    public get(index: number): any {
        const pos = this.stack.length-1-index;
        if (pos >= 0)
            return this.stack[pos];
        else
            throw new Error("Attempt to access position "+(this.stack.length-1-index)+" on stack");
    }

    public popAboveAndSet(index: number, value: any): any {
        const pos = this.stack.length-index-1;
        if (pos >= 0) {
            this.stack[pos] = value;
            this.stack.length = pos+1;
        }
        else {
            throw new Error("Attempt to set position "+(this.stack.length-1-index)+" on stack");
        }
    }

    public attempt(f: () => void): void {
        const start = this.parser.pos;
        const length = this.stack.length;
        try {
            f();
        }
        catch (e) {
            this.parser.pos = start;
            this.stack.length = length;
            throw e;
        }
    }

    public not(f: (b: Builder) => void): void {
        const start = this.parser.pos;
        const length = this.stack.length;

        let hadException = false;
        try {
            f(this);
        }
        catch (e) {
            this.parser.pos = start;
            this.stack.length = length;
            if (!(e instanceof ParseFailure))
                throw e;
            hadException = true;
        }

        this.parser.pos = start;
        this.stack.length = length;

        if (!hadException)
            throw new ParseError(this.parser,this.parser.pos,"NOT predicate failed");
    }

    // F must either throw an exception or result in exactly one extra item on the stack
    public opt(f: (b: Builder) => void): void {
        try {
            this.attempt(() => {
                const oldLength = this.stack.length;
                f(this);
                this.assertLengthIs(oldLength+1);
            });
        }
        catch (e) {
            if (!(e instanceof ParseFailure))
                throw e;
            this.push(null);
        }
    }

    public choice(list: ((b: Builder) => void)[]): void {
        const start = this.parser.pos;
        const length = this.stack.length;
        for (const item of list) {
            try {
                return item(this);
            }
            catch (e) {
                if (!(e instanceof ParseFailure))
                    throw e;
                this.parser.pos = start;
                this.stack.length = length;
            }
        }
        throw new ParseError(this.parser,this.parser.pos,"No valid alternative found");
    }

    public repeat(f: (b: Builder) => void): void {
        while (true) {
            const start = this.parser.pos;
            const length = this.stack.length;
            try {
                f(this);
            }
            catch (e) {
                if (!(e instanceof ParseFailure))
                    throw e;

                this.parser.pos = start;
                this.stack.length = length;
                return;
            }
        }
    }

    public repeatChoice(list: ((b: Builder) => void)[]): void {
        this.repeat(() => this.choice(list));
    }

    public list(first: (b: Builder) => void, rest: (b: Builder) => void): void {
        this.attempt(() => {
            const start = this.parser.pos;
            const elements: ASTNode[] = [];
            const initialLength = this.stack.length;

            first(this);
            this.assertLengthIs(initialLength+1);
            const firstNode = checkNode(this.get(0));
            if (firstNode != null)
                elements.push(firstNode);
            this.stack.pop();

            this.assertLengthIs(initialLength);
            this.repeat(() => {
                rest(this);
                this.assertLengthIs(initialLength+1);
                const node = this.get(0);
                if (node != null)
                    elements.push(node);
                this.stack.pop();
                this.assertLengthIs(initialLength);
            });

            this.assertLengthIs(initialLength);
            const end = (elements.length > 0) ? elements[elements.length-1].range.end : start;
            this.push(new ListNode(new Range(start,end),elements));
        });
    }

    public assertLengthIs(length: number): void {
        if (this.stack.length != length)
            throw new Error("Expected b to have exactly "+length+
                            " items on the stack; have "+this.stack.length);
    }
}

export function not(f: (b: Builder) => void): (b: Builder) => void {
    return (b: Builder) => b.not(f);
}

export function ref(name: string): (b: Builder) => void {
    return (b: Builder) => {
        const production = b.grammar.lookup(name);
        if (production == null)
            throw new Error("Production "+name+" not defined");
        production(b);
    }
}

export function list(first: (b: Builder) => void, rest: (b: Builder) => void): (b: Builder) => void {
    return (b: Builder) => b.list(first,rest);
}

export function sequence(funs: ((b: Builder) => void)[]): (b: Builder) => void {
    return (b: Builder) => b.sequence(funs);
}

export function spliceNull(index: number): (b: Builder) => void {
    return (b: Builder) => b.popAboveAndSet(index,null);
}

export function spliceReplace(index: number, srcIndex: number): (b: Builder) => void {
    return (b: Builder) => b.popAboveAndSet(index,b.get(srcIndex));
}

export function spliceNode(index: number, name: string, startIndex: number, endIndex: number, childIndices: number[]): (b: Builder) => void {
    return (b: Builder) => b.popAboveAndSet(index,makeNode(b,startIndex,endIndex,name,childIndices));
}

export function spliceStringNode(index: number, name: string, startIndex: number, endIndex: number, valueIndex: number): (b: Builder) => void {
    return (b: Builder) => {
        const start = checkNumber(b.get(startIndex));
        const end = checkNumber(b.get(endIndex));
        const range = new Range(start,end);
        const valueNode = checkStringNode(b.get(valueIndex));
        b.popAboveAndSet(index,new GenericStringNode(range,name,valueNode.value));
    };
}

export function spliceNumberNode(index: number, name: string, startIndex: number, endIndex: number, valueIndex: number): (b: Builder) => void {
    return (b: Builder) => {
        const start = checkNumber(b.get(startIndex));
        const end = checkNumber(b.get(endIndex));
        const range = new Range(start,end);
        const valueNode = checkNumberNode(b.get(valueIndex));
        b.popAboveAndSet(index,new GenericNumberNode(range,name,valueNode.value));
    };
}

export function spliceEmptyListNode(index: number, startIndex: number, endIndex: number): (b: Builder) => void {
    return (b: Builder) => b.popAboveAndSet(index,makeEmptyListNode(b,startIndex,endIndex));
}

export function assertLengthIs(length: number): (b: Builder) => void {
    return (b: Builder) => b.assertLengthIs(length);
}

export function push(value: any): (b: Builder) => void {
    return (b: Builder) => b.push(value);
}

export function pop(b: Builder): void {
    b.pop();
}

export function opt(f: (b: Builder) => void): (b: Builder) => void {
    return (b: Builder) => b.opt(f);
}

export function choice(list: ((b: Builder) => void)[]): (b: Builder) => void {
    return (b: Builder) => b.choice(list);
}

export function repeat(f: (b: Builder) => void): (b: Builder) => void {
    return (b: Builder) => b.repeat(f);
}

export function repeatChoice(list: ((b: Builder) => void)[]): (b: Builder) => void {
    return (b: Builder) => b.repeatChoice(list);
}

export function pos(b: Builder) {
    b.push(b.parser.pos);
}

export function value(value: any): (b: Builder) => void {
    return (b: Builder) => b.push(value);
}

export function keyword(str: string): ((b: Builder) => void) {
    return (b: Builder): void => {
        b.parser.expectKeyword(str);
        b.push(null);
    }
}

export function identifier(str: string): (b: Builder) => void {
    return (b: Builder): void => {
        b.attempt((): void => {
            const oldLength = b.stack.length;
            const start = b.parser.pos;
            ref("Identifier")(b);
            b.item(assertLengthIs(oldLength+1));
            const ident = checkNode(b.get(0));
            if (!(ident instanceof GenericStringNode) || (ident.value != str))
                throw new ParseError(b.parser,start,"Expected "+str);
            // Identifier_b will already have pushed onto the stack
        })
    };
}

export function whitespace(b: Builder): void {
    b.parser.skipWhitespace();
    b.push(null);
}

export function whitespaceNoNewline(b: Builder): void {
    b.parser.skipWhitespaceNoNewline();
    b.push(null);
}

export function checkNode(value: any): ASTNode | null {
    if ((value === null) || (value instanceof ASTNode))
        return value;
    else
        throw new CastError(value,"ASTNode | null");
}

export function checkStringNode(value: any): GenericStringNode | null {
    if ((value === null) || (value instanceof GenericStringNode))
        return value;
    else
        throw new CastError(value,"GenericStringNode | null");
}

export function checkNumberNode(value: any): GenericNumberNode | null {
    if ((value === null) || (value instanceof GenericNumberNode))
        return value;
    else
        throw new CastError(value,"GenericNumberNode | null");
}

export function checkListNode(value: any): ListNode | ErrorNode | null {
    if ((value == null) || (value instanceof ListNode) || (value instanceof ErrorNode))
        return value;
    else
        throw new CastError(value,"ListNode | ErrorNode | null");
}

export function checkNumber(value: any): number {
    if (typeof(value) === "number")
        return value;
    throw new CastError(value,"number");
}

export function makeNode(b: Builder, startIndex: number, endIndex: number, name: string, childIndices: number[]): GenericNode {
    const start = checkNumber(b.get(startIndex));
    const end = checkNumber(b.get(endIndex));
    const children: (ASTNode | null)[] = [];
    for (const childIndex of childIndices) {
        children.push(checkNode(b.get(childIndex)));
    }
    return new GenericNode(new Range(start,end),name,children);
}

export function makeEmptyListNode(b: Builder, startIndex: number, endIndex: number): ListNode {
    const start = checkNumber(b.get(startIndex));
    const end = checkNumber(b.get(endIndex));
    return new ListNode(new Range(start,end),[]);
}

export function identifier_token(b: Builder): void {
    b.attempt((): void => {
        const p = b.parser;
        const start = p.pos;
        const oldLength = b.length;
        if ((p.cur != null) && isIdStart(p.cur)) {
            p.next();
            while ((p.cur != null) && isIdChar(p.cur))
                p.next();
            const range = new Range(start,p.pos);
            const value = p.text.substring(range.start,range.end);
            if (isKeyword(value))
                throw new ParseError(p,p.pos,"Keyword "+JSON.stringify(value)+" used where identifier expected");
            b.item(push(new GenericStringNode(range,"Identifier",value)));
            b.item(assertLengthIs(oldLength+1));
            checkNode(b.get(0));
        }
        else {
            throw new ParseError(p,p.pos,"Expected Identifier");
        }
    });
}

export function numeric_literal_token(b: Builder): void {
    // TODO: Complete numeric literal syntax according to spec
    const p = b.parser;
    const start = p.pos;
    while ((p.cur != null) && (p.cur >= "0") && (p.cur <= "9"))
        p.next();
    if (p.pos == start)
        throw new ParseError(p,p.pos,"Expected number");
    if (p.cur == ".") {
        p.next();
        const postDecimal = p.pos;
        while ((p.cur != null) && (p.cur >= "0") && (p.cur <= "9"))
            p.next();
        if (p.pos == postDecimal)
            throw new ParseError(p,p.pos,"Invalid number");
    }
    const value = parseFloat(p.text.substring(start,p.pos));
    b.item(push(new GenericNumberNode(new Range(start,p.pos),"NumericLiteral",value)));
}

export function string_literal_token(b: Builder): void {
    // TODO: Complete string literal syntax according to spec
    const p = b.parser;
    const start = p.pos;
    if ((p.cur == "\"") || (p.cur == "'")) {
        const quote = p.cur;
        p.next();
        let value = "";
        while (true) {
            if ((p.pos+1 < p.len) && (p.text[p.pos] == "\\") && (p.text[p.pos+1] == "\"")) {
                value += "\"";
                p.pos += 2;
            }
            else if ((p.pos+1 < p.len) && (p.text[p.pos] == "\\") && (p.text[p.pos+1] == "'")) {
                value += "'";
                p.pos += 2;
            }
            else if ((p.pos < p.len) && (p.text[p.pos] == "\"") && (quote == "\"")) {
                p.pos++;
                break;
            }
            else if ((p.pos < p.len) && (p.text[p.pos] == "'") && (quote == "'")) {
                p.pos++;
                break;
            }
            else if (p.pos < p.len) {
                value += p.text[p.pos];
                p.pos++;
            }
            else {
                throw new ParseError(p,p.pos,"Unterminated string");
            }
        }
        b.item(push(new GenericStringNode(new Range(start,p.pos),"StringLiteral",value,true)));
        checkNode(b.get(0));
        return;
    }
    throw new ParseError(p,p.pos,"Invalid string");
}
