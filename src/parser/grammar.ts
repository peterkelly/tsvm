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
    Identifier_b
} from "./syntax";
import {
    CastError,
    Range,
    ASTNode,
    ListNode,
    ErrorNode,
    GenericNode,
    ExpressionNode,
} from "./ast";

export class Builder {
    public parser: Parser;
    public stack: any[] = [];
    public constructor(parser: Parser) {
        this.parser = parser;
    }
    public get length(): number {
        return this.stack.length;
    }
    public pitem(f: (p: Parser) => any): void {
        this.stack.push(f(this.parser));
    }
    public pitems(funs: ((p: Parser) => any)[]): void {
        for (const f of funs)
            this.pitem(f);
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

    // F must either throw an exception or result in exactly one extra item on the stack
    public bopt(f: (b: Builder) => void): void {
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

    public bchoice(list: ((b: Builder) => void)[]): void {
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

    public brepeat(f: (b: Builder) => void): void {
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

    public brepeatChoice(list: ((b: Builder) => void)[]): void {
        this.brepeat(() => this.bchoice(list));
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
            this.brepeat(() => {
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

export function opt<T>(f: (p: Parser) => T): (p: Parser) => T {
    return (p: Parser): T => p.opt(f);
}

export function pos(p: Parser) {
    return p.pos;
}

export function value<T>(value: T): (p: Parser) => T {
    return (p: Parser) => value;
}

export function keyword(str: string): ((p: Parser) => void) {
    return (p: Parser): void => p.expectKeyword(str);
}

export function punctuator(str: string): (p: Parser) => void {
    return (p: Parser): void => p.expectPunctuator(str);
}

export function notKeyword(str: string) {
    return (p: Parser): void => {
        if (p.lookaheadKeyword(str))
            throw new ParseError(p,p.pos,"Unexpected "+str);
    };
}

export function notPunctuator(str: string) {
    return (p: Parser): void => {
        if (p.lookaheadPunctuator(str))
            throw new ParseError(p,p.pos,"Unexpected "+str);
    };
}

export function identifier(str: string) {
    return (p: Parser): void => {
        const ident = pfun(Identifier_b)(p);
        if (ident instanceof ErrorNode)
            throw new ParseError(p,p.pos,"Expected "+str);
        if (ident.value != str)
            throw new ParseError(p,p.pos,"Expected "+str);
    };
}

export function whitespace(p: Parser): void {
    p.skipWhitespace();
}

export function whitespaceNoNewline(p: Parser): void {
    p.skipWhitespaceNoNewline();
}

export function bfun(f: (p: Parser) => any): (b: Builder) => void {
    return (b: Builder) => {
        b.pitem(f);
    };
}

export function pfun(f: (b: Builder) => void): (p: Parser) => any {
    return (p: Parser) => {
        return p.attempt(() => {
            const b = new Builder(p);
            const oldLength = b.length;
            f(b);
            b.assertLengthIs(oldLength+1);
            return checkNode(b.get(0));
        });
    }
}

export function checkNode(value: any): ASTNode | null {
    if ((value === null) || (value instanceof ASTNode))
        return value;
    else
        throw new CastError(value,"ASTNode | null");
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
